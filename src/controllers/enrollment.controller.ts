import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { enrollmentService } from '../services';
import { EnrollmentCreateSchema } from '../types/enrollment.types';
import httpStatus from 'http-status';
import { EnrollmentStatus } from '@prisma/client';

/**
 * Create a new enrollment.
 */
const createEnrollment = catchAsync(async (req: Request, res: Response) => {
  const enrollmentData = EnrollmentCreateSchema.parse(req.body);

  const enrollment = await enrollmentService.createEnrollment(enrollmentData);

  res.status(httpStatus.CREATED).send(enrollment);
});

/**
 * @description Controller function to search enrollments with pagination and filtering.
 * Extracts query parameters and calls the enrollment service.
 */
const searchEnrollments = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const clientId = req.query.clientId as string | undefined;
  const programId = req.query.programId as string | undefined;
  const status = req.query.status as EnrollmentStatus | undefined;
  const sortBy = req.query.sortBy as string | undefined;

  const result = await enrollmentService.queryEnrollments(
    page,
    limit,
    clientId,
    programId,
    status,
    sortBy
  );

  res.status(httpStatus.OK).send(result);
});

/**
 * @description Controller function to get enrollments for a specific client with pagination and sorting.
 * Extracts client ID from params and pagination/sorting options from query parameters.
 */
const getClientEnrollments = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.params.clientId as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sortBy = req.query.sortBy as string | undefined;

  const result = await enrollmentService.getEnrollmentsByClientId(page, limit, clientId, sortBy);

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

const getEnrollmentById = catchAsync(async (req: Request, res: Response) => {
  const enrollmentId = req.params.enrollmentId;
  const enrollment = await enrollmentService.getEnrollmentById(enrollmentId);
  if (!enrollment) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'Enrollment not found' });
  }
  res.status(httpStatus.OK).send(enrollment);
});

export default {
  createEnrollment,
  getClientEnrollments,
  updateEnrollment,
  deleteEnrollment,
  searchEnrollments,
  getEnrollmentById
};
