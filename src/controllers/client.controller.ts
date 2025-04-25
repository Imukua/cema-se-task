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
 * Search clients with pagination and filtering.
 */
const searchClients = catchAsync(async (req: Request, res: Response) => {
  const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
  const options = req.query.options ? JSON.parse(req.query.options as string) : {};

  const result = await clientService.queryClients(filter, options);

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

export default {
  createClient,
  searchClients,
  getClientProfile,
  updateClient,
  deleteClient
};
