import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { enrollmentService } from '../services';
import { EnrollmentCreateSchema } from '../types/enrollment.types';
import httpStatus from 'http-status';

/**
 * Create a new enrollment.
 */
const createEnrollment = catchAsync(async (req: Request, res: Response) => {
  const enrollmentData = EnrollmentCreateSchema.parse(req.body);

  const enrollment = await enrollmentService.createEnrollment(enrollmentData);

  res.status(httpStatus.CREATED).send(enrollment);
});

/**
 * Get enrollments for a specific client with pagination.
 */
const getClientEnrollments = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.params.clientId;

  const options = req.query.options ? JSON.parse(req.query.options as string) : {};

  const result = await enrollmentService.getEnrollmentsByClientId(clientId, options);

  res.status(httpStatus.OK).send(result);
});

/**
 * Update an enrollment by ID.
 */
const updateEnrollment = catchAsync(async (req: Request, res: Response) => {
  const enrollmentId = req.params.enrollmentId;
  const updateBody = req.body;

  const enrollment = await enrollmentService.updateEnrollmentById(enrollmentId, updateBody);

  res.status(httpStatus.OK).send(enrollment);
});

/**
 * Delete an enrollment by ID.
 */
const deleteEnrollment = catchAsync(async (req: Request, res: Response) => {
  const enrollmentId = req.params.enrollmentId;

  await enrollmentService.deleteEnrollmentById(enrollmentId);

  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createEnrollment,
  getClientEnrollments,
  updateEnrollment,
  deleteEnrollment
};
