import prisma from '../db.client';
import { Client, ClientCreate, ClientUpdate } from '../types/client.types';
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

/**
 * Create a client
 * @param {ClientCreate & { userId: string }} clientData - The client data for creation, including the user ID.
 * @returns {Promise<Client>} The created client.
 * @throws {ApiError} If client with same name and contact already exists
 */
const createClient = async (clientData: ClientCreate & { userId: string }): Promise<Client> => {
  // Check if client with same name and contact exists
  const existingClient = await prisma.client.findFirst({
    where: {
      fullName: clientData.fullName,
      contact: clientData.contact
    }
  });

  if (existingClient) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Client with this name and contact number already exists'
    );
  }

  const client = await prisma.client.create({
    data: clientData
  });
  return client;
};

/**
 * Query for clients with pagination and optional filtering (search)
 * @param {object} filter - Filter options (e.g., { fullName: { contains: 'John' }, contact: '123' })
 * @param {object} options - Query options (e.g., { limit: 10, page: 1, sortBy: 'createdAt:asc' })
 * @returns {Promise<QueryResult<Client>>} Paginated result of clients.
 */
const queryClients = async (
  filter: Prisma.ClientWhereInput,
  options: { limit?: number; page?: number; sortBy?: string }
): Promise<{
  results: Client[];
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

  const clients = await prisma.client.findMany({
    where: filter,
    skip,
    take: limit,
    orderBy: sortBy
  });

  const totalResults = await prisma.client.count({
    where: filter
  });

  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: clients,
    totalResults,
    limit,
    page,
    totalPages
  };
};

/**
 * Get client by id, including their enrollments
 * @param {string} id - Client ID.
 * @returns {Promise<Client | null>} The client with enrollments, or null if not found.
 */
const getClientById = async (id: string): Promise<(Client & { programs: any[] }) | null> => {
  return prisma.client.findUnique({
    where: { id },
    include: {
      programs: {
        include: {
          healthProgram: true
        }
      }
    }
  });
};

/**
 * Update client by id
 * @param {string} clientId - Client ID.
 * @param {ClientUpdate} updateBody - The update data.
 * @returns {Promise<Client>} The updated client.
 */
const updateClientById = async (clientId: string, updateBody: ClientUpdate): Promise<Client> => {
  const client = await getClientById(clientId);

  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
  }

  const updatedClient = await prisma.client.update({
    where: { id: clientId },
    data: updateBody
  });
  return updatedClient;
};

/**
 * Delete client by id
 * @param {string} clientId - Client ID.
 * @returns {Promise<Client>} The deleted client.
 */
const deleteClientById = async (clientId: string): Promise<Client> => {
  const client = await getClientById(clientId);

  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
  }

  await prisma.client.delete({
    where: { id: clientId }
  });
  return client;
};

export default {
  createClient,
  queryClients,
  getClientById,
  updateClientById,
  deleteClientById
};
