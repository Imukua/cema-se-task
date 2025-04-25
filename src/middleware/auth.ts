import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import ApiError from '../utils/ApiError';
import { User } from '@prisma/client';
import httpStatus from 'http-status';

/**
 * Middleware to authenticate requests using Passport.js
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>} Promise that resolves when authentication is complete
 */
const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        (err: unknown, user: User | false, info: unknown) => {
          if (err || info || !user) {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
          }
          req.user = user;
          resolve(user);
        }
      )(req, res, next);
    });
    next();
  } catch (err) {
    next(err);
  }
};

export default auth;
