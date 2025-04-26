import prisma from '../db.client';
import { User, UserUpdate } from '../types/user.types';
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

/**
 * Query for users with specific filters and pagination
 * @param {number} page - Current page number (defaults to 1)
 * @param {number} limit - Maximum number of results per page (defaults to 10)
 * @param {string} [search] - Optional search term for user name or email
 * @param {string} [sortBy] - Sort option in the format: field:(asc|desc)
 * @returns {Promise<PaginatedResult<User>>} Paginated result of users.
 */
const queryUsers = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortBy?: string
): Promise<{
  results: User[];
  totalResults: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage?: boolean;
}> => {
  const skip = (page - 1) * limit;

  const filters: Prisma.UserWhereInput = {};

  if (search) {
    filters.OR = [
      { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
    ];
  }

  let orderBy: any = {};
  if (sortBy) {
    const [key, order] = sortBy.split(':');
    if (key && (order === 'asc' || order === 'desc')) {
      orderBy = { [key]: order };
    }
  } else {
    orderBy = { createdAt: 'desc' };
  }
  const users = await prisma.user.findMany({
    where: filters,
    skip,
    take: limit,
    orderBy: orderBy
  });

  const totalResults = await prisma.user.count({
    where: filters
  });

  const totalPages = Math.ceil(totalResults / limit);

  const hasNextPage = skip + limit < totalResults;

  return {
    results: users,
    totalResults,
    limit,
    page,
    totalPages,
    hasNextPage
  };
};
/**
 * Get user by id
 * @param {string} id - User ID.
 * @returns {Promise<User | null>} The user or null if not found.
 */
const getUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Get user by email
 * @param {string} email - User email.
 * @returns {Promise<User | null>} The user or null if not found.
 */
const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Update user by id
 * @param {string} userId - User ID.
 * @param {UserUpdate} updateBody - The update data.
 * @returns {Promise<User>} The updated user.
 */
const updateUserById = async (userId: string, updateBody: UserUpdate): Promise<User> => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateBody.email && updateBody.email !== user.email) {
    const existingUserWithEmail = await getUserByEmail(updateBody.email);
    if (existingUserWithEmail) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateBody
  });
  return updatedUser;
};

/**
 * Delete user by id
 * @param {string} userId - User ID.
 * @returns {Promise<User>} The deleted user.
 */
const deleteUserById = async (userId: string): Promise<User> => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await prisma.user.delete({
    where: { id: userId }
  });
  return user;
};

export default {
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
};
