import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { programService } from '../services';
import { HealthProgramCreateSchema, HealthProgramUpdateSchema } from '../types/healthProgram.types';
import httpStatus from 'http-status';

/**
 * Create a new health program.
 */
const createProgram = catchAsync(async (req: Request, res: Response) => {
  const programData = HealthProgramCreateSchema.parse(req.body);

  const program = await programService.createProgram(programData);

  res.status(httpStatus.CREATED).send(program);
});

/**
 * Get health programs with pagination and filtering.
 */
const getPrograms = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string | undefined;
  const sortBy = req.query.sortBy as string | undefined;

  const result = await programService.queryPrograms(page, limit, search, sortBy);
  res.status(httpStatus.OK).send(result);
});

/**
 * Get a health program by ID.
 */
const getProgram = catchAsync(async (req: Request, res: Response) => {
  const programId = req.params.programId;

  const program = await programService.getProgramById(programId);

  res.status(httpStatus.OK).send(program);
});

/**
 * Update a health program by ID.
 */
const updateProgram = catchAsync(async (req: Request, res: Response) => {
  const programId = req.params.programId;
  const updateBody = HealthProgramUpdateSchema.parse(req.body);

  const program = await programService.updateProgramById(programId, updateBody);

  res.status(httpStatus.OK).send(program);
});

/**
 * Delete a health program by ID.
 */
const deleteProgram = catchAsync(async (req: Request, res: Response) => {
  const programId = req.params.programId;

  await programService.deleteProgramById(programId);

  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createProgram,
  getPrograms,
  getProgram,
  updateProgram,
  deleteProgram
};
