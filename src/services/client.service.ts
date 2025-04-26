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
 * Query for clients with specific filters and pagination
 * @param {number} page - Current page number (defaults to 1)
 * @param {number} limit - Maximum number of results per page (defaults to 10)
 * @param {string} [search] - Optional search term for fullName or contact
 * @param {string} [gender] - Optional filter by gender
 * @param {string} [sortBy] - Sort option in the format: field:(asc|desc)
 * @returns {Promise<PaginatedResult<Client>>}
 */
const queryClients = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  gender?: string,
  sortBy?: string
): Promise<{
  results: Client[];
  totalResults: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}> => {
  const skip = (page - 1) * limit;

  // Build the filter object dynamically
  const filters: Prisma.ClientWhereInput = {};

  if (search) {
    // Assuming search applies to fullName or contact
    filters.OR = [
      { fullName: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { contact: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
    ];
  }

  if (gender) {
    filters.gender = gender;
  }

  // Correctly parse sortBy string
  let orderBy: any = {};
  if (sortBy) {
    const [key, order] = sortBy.split(':');
    if (key && (order === 'asc' || order === 'desc')) {
      // Ensure the key is a valid sortable field for Client
      // Add checks here if necessary, e.g., if (!['fullName', 'createdAt'].includes(key)) throw new Error('Invalid sort field');
      orderBy = { [key]: order };
    }
    // Optional: Add error handling here if sortBy format is invalid
  } else {
    // Default sort if none is provided
    orderBy = { createdAt: 'desc' };
  }

  // Fetch the clients with pagination and filters
  const clients = await prisma.client.findMany({
    where: filters,
    skip,
    take: limit,
    orderBy: orderBy // Use the correctly parsed orderBy object
  });

  // Get the total count of clients with the same filters
  const totalResults = await prisma.client.count({
    where: filters
  });

  const totalPages = Math.ceil(totalResults / limit);

  // Calculate if there is a next page
  const hasNextPage = skip + limit < totalResults;

  return {
    results: clients,
    totalResults,
    limit,
    page,
    totalPages,
    hasNextPage
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
