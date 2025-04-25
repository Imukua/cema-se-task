import prisma from '../db.client';
import { User, UserUpdate } from '../types/user.types';
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

/**
 * Query for users with pagination
 * @param {object} filter - Filter options (e.g., { name: 'John', role: 'USER' })
 * @param {object} options - Query options (e.g., { limit: 10, page: 1, sortBy: 'createdAt:asc' })
 * @returns {Promise<QueryResult<User>>} Paginated result of users.
 */
const queryUsers = async (
  filter: Prisma.UserWhereInput,
  options: { limit?: number; page?: number; sortBy?: string }
): Promise<{
  results: User[];
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

  const users = await prisma.user.findMany({
    where: filter,
    skip,
    take: limit,
    orderBy: sortBy
  });

  const totalResults = await prisma.user.count({
    where: filter
  });

  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: users,
    totalResults,
    limit,
    page,
    totalPages
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
