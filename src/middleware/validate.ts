import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const validatedData = req.body;
  const validationResult = schema.safeParse(validatedData);

  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors
      .map((error) => {
        const path = error.path.join('.') || 'field';
        return `${path}: ${error.message || 'Invalid input'}`;
      })
      .join(', ');

    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  // Assign validated values back to req
  Object.assign(req, { body: validationResult.data });
  return next();
};

export default validate;
