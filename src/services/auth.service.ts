import prisma from '../client';
import { User, UserCreate } from '../types/user.types';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import moment from 'moment';
import encription from '../utils/encription';

/**
 * Create a user
 * @param {UserCreate} userData - The user data for creation.
 * @returns {Promise<User>} The created user.
 */
const createUser: (userData: UserCreate) => Promise<User> = async (userData) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const hashedPassword = await encription.hashPassword('password');

  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword
    }
  });
  return user;
};

/**
 * Login with username and password
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<User>} The authenticated user.
 */
const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  const isPasswordMatch = await encription.comparePasswords(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return user;
};

/**
 * Generate JWT tokens
 * @param {User} user - The user object.
 * @returns {Promise<{ access: { token: string, expires: Date }, refresh: { token: string, expires: Date } }>} The access and refresh tokens.
 */
const generateAuthTokens = async (
  user: User
): Promise<{
  access: { token: string; expires: Date };
  refresh: { token: string; expires: Date };
}> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = jwt.sign({ sub: user.id, role: user.role }, config.jwt.secret, {
    expiresIn: `${config.jwt.accessExpirationMinutes}m`
  });

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = jwt.sign({ sub: user.id, role: user.role }, config.jwt.secret, {
    expiresIn: `${config.jwt.refreshExpirationDays}d`
  });

  await saveToken(refreshToken, user.id, refreshTokenExpires.toDate());

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};

/**
 * Save a token
 * @param {string} token - The token string.
 * @param {string} userId - The user ID associated with the token.
 * @param {Date} expires - The expiration date of the token.
 * @param {'refresh' | 'resetPassword' | 'verifyEmail'} type - The type of token.
 * @returns {Promise<Token>} The saved token record.
 */
const saveToken = async (token: string, userId: string, expires: Date): Promise<any> => {
  const tokenDoc = await prisma.token.create({
    data: {
      token,
      userId,
      expiresAt: expires
      // Assuming your Token model has a 'type' field
      // type, // Add type field if it exists in your Token model
    }
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token - The token string.
 * @param {'refresh' | 'resetPassword' | 'verifyEmail'} type - The type of token.
 * @returns {Promise<Token>} The token record.
 */
const verifyToken = async (token: string): Promise<any> => {
  const tokenDoc = await prisma.token.findFirst({
    where: {
      token,
      // Assuming your Token model has a 'type' field
      // type, // Add type field if it exists in your Token model
      expiresAt: { gt: new Date() } // Check if token is not expired
    }
  });

  if (!tokenDoc) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found or expired');
  }

  // Optional: Verify the JWT payload if it's a JWT token
  try {
    jwt.verify(token, config.jwt.secret);
  } catch (error: any) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Token verification failed:  ${error.message}`);
  }

  return tokenDoc;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken - The refresh token string.
 * @returns {Promise<{ access: { token: string, expires: Date }, refresh: { token: string, expires: Date } }>} The new access and refresh tokens.
 */
const refreshAuthTokens = async (
  refreshToken: string
): Promise<{
  access: { token: string; expires: Date };
  refresh: { token: string; expires: Date };
}> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: refreshTokenDoc.userId }
    });

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    // Delete the old refresh token
    await prisma.token.delete({
      where: { id: refreshTokenDoc.id }
    });

    // Generate new tokens
    const newAuthTokens = await generateAuthTokens(user);
    return newAuthTokens;
  } catch (error: any) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Authentication failed: ${error.message}`);
  }
};

export default {
  createUser,
  loginUserWithEmailAndPassword,
  generateAuthTokens,
  refreshAuthTokens,
  saveToken,
  verifyToken
};
