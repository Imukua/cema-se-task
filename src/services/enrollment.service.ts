import prisma from '../db.client';
import { Enrollment, EnrollmentCreate, EnrollmentUpdate } from '../types/enrollment.types';
import { EnrollmentStatus, Prisma } from '@prisma/client';
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
 * Query for enrollments with specific filters and pagination
 * @param {number} page - Current page number (defaults to 1)
 * @param {number} limit - Maximum number of results per page (defaults to 10)
 * @param {string} [clientId] - Optional filter by client ID
 * @param {string} [programId] - Optional filter by program ID
 * @param {EnrollmentStatus} [status] - Optional filter by enrollment status
 * @param {string} [sortBy] - Sort option in the format: field:(asc|desc)
 * @returns {Promise<PaginatedResult<Enrollment>>}
 */
const queryEnrollments = async (
  page: number = 1,
  limit: number = 10,
  clientId?: string,
  programId?: string,
  status?: EnrollmentStatus,
  sortBy?: string
): Promise<{
  results: Enrollment[];
  totalResults: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}> => {
  const skip = (page - 1) * limit;

  // Build the filter object dynamically
  const filters: Prisma.EnrollmentWhereInput = {};

  if (clientId) {
    filters.clientId = clientId;
  }

  if (programId) {
    filters.programId = programId;
  }

  if (status) {
    filters.status = status;
  }

  // Correctly parse sortBy string
  let orderBy: any = {};
  if (sortBy) {
    const [key, order] = sortBy.split(':');
    if (key && (order === 'asc' || order === 'desc')) {
      // Ensure the key is a valid sortable field for Enrollment
      // Add checks here if necessary, e.g., if (!['enrolledAt', 'status', 'createdAt'].includes(key)) throw new Error('Invalid sort field');
      orderBy = { [key]: order };
    }
    // Optional: Add error handling here if sortBy format is invalid
  } else {
    // Default sort if none is provided
    orderBy = { enrolledAt: 'desc' }; // Default sort by enrollment date descending
  }

  // Fetch the enrollments with pagination and filters, including related client and program
  const enrollments = await prisma.enrollment.findMany({
    where: filters,
    skip,
    take: limit,
    orderBy: orderBy, // Use the correctly parsed orderBy object
    include: {
      client: true,
      healthProgram: true
    }
  });

  // Get the total count of enrollments with the same filters
  const totalResults = await prisma.enrollment.count({
    where: filters
  });

  const totalPages = Math.ceil(totalResults / limit);

  // Calculate if there is a next page
  const hasNextPage = skip + limit < totalResults;

  return {
    results: enrollments,
    totalResults,
    limit,
    page,
    totalPages,
    hasNextPage
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
 * Get enrollments for a specific client with pagination and sorting.
 * @param {string} clientId - The ID of the client.
 * @param {PaginationOptions} options - Pagination and sorting options.
 * @returns {Promise<PaginatedResult<Enrollment>>}
 * @throws {ApiError} If the client is not found.
 */
const getEnrollmentsByClientId = async (
  page: number = 1,
  limit: number = 10,
  clientId?: string,
  programId?: string,
  status?: EnrollmentStatus,
  sortBy?: string
): Promise<{
  results: Enrollment[];
  totalResults: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}> => {
  // Check if the client exists
  const clientExists = await prisma.client.findUnique({ where: { id: clientId } });
  if (!clientExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
  }

  return queryEnrollments(page, limit, clientId, programId, status, sortBy);
};

export default {
  createEnrollment,
  queryEnrollments,
  getEnrollmentById,
  updateEnrollmentById,
  deleteEnrollmentById,
  getEnrollmentsByClientId
};
