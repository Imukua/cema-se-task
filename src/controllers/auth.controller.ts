import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { UserCreateSchema } from '../types/user.types';
import httpStatus from 'http-status';
import { authService } from '../services';

/**
 * Register a new user.
 */
const register = catchAsync(async (req: Request, res: Response) => {
  const userData = UserCreateSchema.parse(req.body);
  const user = await authService.createUser(userData);
  const tokens = await authService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

/**
 * Login a user with email and password.
 */
const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await authService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ user, tokens });
});

/**
 * Refresh access and refresh tokens.
 */
const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAuthTokens(refreshToken);
  res.status(httpStatus.OK).send({ tokens });
});

export default {
  register,
  login,
  refreshTokens
};
