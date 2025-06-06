import prisma from '../db.client';
import {
  HealthProgram,
  HealthProgramCreate,
  HealthProgramUpdate
} from '../types/healthProgram.types';
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

/**
 * Create a health program
 * @param {HealthProgramCreate} programData - The program data for creation.
 * @returns {Promise<HealthProgram>} The created program.
 */
const createProgram = async (programData: HealthProgramCreate): Promise<HealthProgram> => {
  const existingProgram = await prisma.healthProgram.findUnique({
    where: { name: programData.name }
  });

  if (existingProgram) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Program name already exists');
  }

  const program = await prisma.healthProgram.create({
    data: programData
  });
  return program;
};

/**
 * Query for health programs with specific filters and pagination
 * @param {number} page - Current page number (defaults to 1)
 * @param {number} limit - Maximum number of results per page (defaults to 10)
 * @param {string} [search] - Optional search term for program name or description
 * @param {string} [sortBy] - Sort option in the format: field:(asc|desc)
 * @returns {Promise<PaginatedResult<HealthProgram>>}
 */
const queryPrograms = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortBy?: string
): Promise<{
  results: HealthProgram[];
  totalResults: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}> => {
  const skip = (page - 1) * limit;

  // Build the filter object dynamically
  const filters: Prisma.HealthProgramWhereInput = {};

  if (search) {
    // Assuming search applies to name or description
    filters.OR = [
      { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
    ];
  }

  // Correctly parse sortBy string
  let orderBy: any = {};
  if (sortBy) {
    const [key, order] = sortBy.split(':');
    if (key && (order === 'asc' || order === 'desc')) {
      // Ensure the key is a valid sortable field for HealthProgram
      // Add checks here if necessary, e.g., if (!['name', 'createdAt'].includes(key)) throw new Error('Invalid sort field');
      orderBy = { [key]: order };
    }
    // Optional: Add error handling here if sortBy format is invalid
  } else {
    // Default sort if none is provided
    orderBy = { createdAt: 'desc' };
  }

  // Fetch the programs with pagination and filters
  const programs = await prisma.healthProgram.findMany({
    where: filters,
    skip,
    take: limit,
    orderBy: orderBy // Use the correctly parsed orderBy object
  });

  // Get the total count of programs with the same filters
  const totalResults = await prisma.healthProgram.count({
    where: filters
  });

  const totalPages = Math.ceil(totalResults / limit);

  // Calculate if there is a next page
  const hasNextPage = skip + limit < totalResults;

  return {
    results: programs,
    totalResults,
    limit,
    page,
    totalPages,
    hasNextPage
  };
};
/**
 * Get health program by id
 * @param {string} id - Program ID.
 * @returns {Promise<HealthProgram | null>} The program or null if not found.
 */
const getProgramById = async (id: string): Promise<HealthProgram | null> => {
  return prisma.healthProgram.findUnique({
    where: { id }
  });
};

/**
 * Update health program by id
 * @param {string} programId - Program ID.
 * @param {HealthProgramUpdate} updateBody - The update data.
 * @returns {Promise<HealthProgram>} The updated program.
 */
const updateProgramById = async (
  programId: string,
  updateBody: HealthProgramUpdate
): Promise<HealthProgram> => {
  const program = await getProgramById(programId);

  if (!program) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Health Program not found');
  }

  if (updateBody.name && updateBody.name !== program.name) {
    const existingProgramWithSameName = await prisma.healthProgram.findUnique({
      where: { name: updateBody.name }
    });
    if (existingProgramWithSameName) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Program name already exists');
    }
  }

  const updatedProgram = await prisma.healthProgram.update({
    where: { id: programId },
    data: updateBody
  });
  return updatedProgram;
};

/**
 * Delete health program by id
 * @param {string} programId - Program ID.
 * @returns {Promise<HealthProgram>} The deleted program.
 */
const deleteProgramById = async (programId: string): Promise<HealthProgram> => {
  const program = await getProgramById(programId);

  if (!program) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Health Program not found');
  }

  await prisma.healthProgram.delete({
    where: { id: programId }
  });
  return program;
};

export default {
  createProgram,
  queryPrograms,
  getProgramById,
  updateProgramById,
  deleteProgramById
};
