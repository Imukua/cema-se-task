import prisma from '../db.client';
import { Enrollment, EnrollmentCreate, EnrollmentUpdate } from '../types/enrollment.types';
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

/**
 * Create an enrollment
 * @param {EnrollmentCreate} enrollmentData - The enrollment data for creation.
 * @returns {Promise<Enrollment>} The created enrollment.
 */
const createEnrollment = async (enrollmentData: EnrollmentCreate): Promise<Enrollment> => {
  const clientExists = await prisma.client.findUnique({ where: { id: enrollmentData.clientId } });
  if (!clientExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
  }

  const programExists = await prisma.healthProgram.findUnique({
    where: { id: enrollmentData.programId }
  });
  if (!programExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Health Program not found');
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      clientId_programId: {
        clientId: enrollmentData.clientId,
        programId: enrollmentData.programId
      }
    }
  });

  if (existingEnrollment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client is already enrolled in this program');
  }

  const enrollment = await prisma.enrollment.create({
    data: enrollmentData
  });
  return enrollment;
};

/**
 * Query for enrollments with pagination and optional filtering
 * @param {object} filter - Filter options (e.g., { clientId: 'abc', status: 'active' })
 * @param {object} options - Query options (e.g., { limit: 10, page: 1, sortBy: 'enrolledAt:desc' })
 * @returns {Promise<QueryResult<Enrollment>>} Paginated result of enrollments.
 */
const queryEnrollments = async (
  filter: Prisma.EnrollmentWhereInput,
  options: { limit?: number; page?: number; sortBy?: string }
): Promise<{
  results: Enrollment[];
  totalResults: number;
  limit: number;
  page: number;
  totalPages: number;
}> => {
  const limit = options.limit ? options.limit : 10;
  const page = options.page ? options.page : 1;
  const skip = (page - 1) * limit;
  const sortBy: any = options.sortBy
    ? options.sortBy
        .split(':')
        .reduce((acc: any, [key, order]: any) => ({ ...acc, [key]: order }), {})
    : {};

  const enrollments = await prisma.enrollment.findMany({
    where: filter,
    skip,
    take: limit,
    orderBy: sortBy,
    include: {
      client: true,
      healthProgram: true
    }
  });

  const totalResults = await prisma.enrollment.count({
    where: filter
  });

  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: enrollments,
    totalResults,
    limit,
    page,
    totalPages
  };
};

/**
 * Get enrollment by id
 * @param {string} id - Enrollment ID.
 * @returns {Promise<Enrollment | null>} The enrollment or null if not found.
 */
const getEnrollmentById = async (id: string): Promise<Enrollment | null> => {
  return prisma.enrollment.findUnique({
    where: { id },
    include: {
      client: true,
      healthProgram: true
    }
  });
};

/**
 * Update enrollment by id
 * @param {string} enrollmentId - Enrollment ID.
 * @param {Prisma.EnrollmentUpdateInput} updateBody - The update data.
 * @returns {Promise<Enrollment>} The updated enrollment.
 */
const updateEnrollmentById = async (
  enrollmentId: string,
  updateBody: EnrollmentUpdate
): Promise<Enrollment> => {
  const enrollment = await getEnrollmentById(enrollmentId);

  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  const updatedEnrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: updateBody
  });
  return updatedEnrollment;
};

/**
 * Delete enrollment by id
 * @param {string} enrollmentId - Enrollment ID.
 * @returns {Promise<Enrollment>} The deleted enrollment.
 */
const deleteEnrollmentById = async (enrollmentId: string): Promise<Enrollment> => {
  const enrollment = await getEnrollmentById(enrollmentId);

  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  await prisma.enrollment.delete({
    where: { id: enrollmentId }
  });
  return enrollment;
};

/**
 * Get enrollments for a specific client with pagination
 * @param {string} clientId - Client ID.
 * @param {object} options - Query options (e.g., { limit: 10, page: 1, sortBy: 'enrolledAt:desc' })
 * @returns {Promise<QueryResult<Enrollment>>} Paginated result of enrollments for the client.
 */
const getEnrollmentsByClientId = async (
  clientId: string,
  options: { limit?: number; page?: number; sortBy?: string }
): Promise<{
  results: Enrollment[];
  totalResults: number;
  limit: number;
  page: number;
  totalPages: number;
}> => {
  const clientExists = await prisma.client.findUnique({ where: { id: clientId } });
  if (!clientExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
  }

  const filter: Prisma.EnrollmentWhereInput = { clientId };
  return queryEnrollments(filter, options);
};

export default {
  createEnrollment,
  queryEnrollments,
  getEnrollmentById,
  updateEnrollmentById,
  deleteEnrollmentById,
  getEnrollmentsByClientId
};
