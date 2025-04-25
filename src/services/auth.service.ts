import prisma from '../db.client';
import { User, UserCreate } from '../types/user.types';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import jwt from 'jsonwebtoken';
import config from '../config/config';
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

  const hashedPassword = await encription.hashPassword(userData.password);

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
  userId: string
): Promise<{ access: { token: string }; refresh: { token: string } }> => {
  const now = Math.floor(Date.now() / 1000);
  const acc_exp = now + config.jwt.accessExpirationMinutes * 60;
  const ref_exp = now + config.jwt.refreshExpirationDays * 24 * 60 * 60;
  const iat = now;
  const accessPayload = {
    id: userId,
    iat: iat,
    exp: acc_exp
  };
  const refreshPayload = {
    id: userId,
    iat: iat,
    exp: ref_exp
  };
  const accessToken = jwt.sign(accessPayload, config.jwt.secret);
  const refreshToken = jwt.sign(refreshPayload, config.jwt.secret);

  await saveToken(userId, refreshToken, new Date(refreshPayload.exp * 1000).toISOString());

  return {
    access: {
      token: accessToken
    },
    refresh: {
      token: refreshToken
    }
  };
};
/**
 * Save a token
 * @param {string} refreshToken - The token string.
 * @param {string} userId - The user ID associated with the token.
 * @param {String} expiresAt - The expiration date of the token.
 */
const saveToken = async (
  userId: string,
  refreshToken: string,
  expiresAt: string
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tokenDoc = await prisma.token.create({
    data: {
      token: refreshToken,
      userId: userId,
      expiresAt: new Date(expiresAt)
    }
  });
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
  access: { token: string };
  refresh: { token: string };
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
    const newAuthTokens = await generateAuthTokens(user.id);
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
