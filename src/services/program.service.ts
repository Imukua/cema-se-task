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
 * Query for health programs with pagination
 * @param {object} filter - Filter options (e.g., { name: 'HIV' })
 * @param {object} options - Query options (e.g., { limit: 10, page: 1, sortBy: 'createdAt:asc' })
 * @returns {Promise<QueryResult<HealthProgram>>} Paginated result of programs.
 */
const queryPrograms = async (
  filter: Prisma.HealthProgramWhereInput,
  options: { limit?: number; page?: number; sortBy?: string }
): Promise<{
  results: HealthProgram[];
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

  const programs = await prisma.healthProgram.findMany({
    where: filter,
    skip,
    take: limit,
    orderBy: sortBy
  });

  const totalResults = await prisma.healthProgram.count({
    where: filter
  });

  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: programs,
    totalResults,
    limit,
    page,
    totalPages
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
