import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { clientService } from '../services';
import { ClientCreateSchema, ClientUpdateSchema } from '../types/client.types';
import httpStatus from 'http-status';

/**
 * Create a new client.
 */
const createClient = catchAsync(async (req: Request, res: Response) => {
  const clientData = ClientCreateSchema.parse(req.body);

  const userId = (req as any).user.id;

  const client = await clientService.createClient({ ...clientData, userId });

  res.status(httpStatus.CREATED).send(client);
});

/**
 * @description Controller function to search clients with pagination and filtering.
 * Extracts query parameters and calls the client service.
 */
const searchClients = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string | undefined;
  const gender = req.query.gender as string | undefined;
  const sortBy = req.query.sortBy as string | undefined;

  const result = await clientService.queryClients(page, limit, search, gender, sortBy);

  res.status(httpStatus.OK).send(result);
});

/**
 * Get a client profile by ID, including enrollments.
 */
const getClientProfile = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.params.clientId;

  const client = await clientService.getClientById(clientId);

  res.status(httpStatus.OK).send(client);
});

/**
 * Update a client by ID.
 */
const updateClient = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.params.clientId;
  const updateBody = ClientUpdateSchema.parse(req.body);

  const client = await clientService.updateClientById(clientId, updateBody);

  res.status(httpStatus.OK).send(client);
});

/**
 * Delete a client by ID.
 */
const deleteClient = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.params.clientId;

  await clientService.deleteClientById(clientId);

  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get statistics about clients.
 */
const getStatistics = catchAsync(async (req: Request, res: Response) => {
  const statistics = await clientService.getStatistics();

  res.status(httpStatus.OK).send(statistics);
});

export default {
  createClient,
  searchClients,
  getClientProfile,
  updateClient,
  deleteClient,
  getStatistics
};
