import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';
import { UserUpdateSchema } from '../types/user.types';
import httpStatus from 'http-status';

const getUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const user = await userService.getUserById(userId);

  res.status(httpStatus.OK).send(user);
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string | undefined;
  const sortBy = req.query.sortBy as string | undefined;

  const result = await userService.queryUsers(page, limit, search, sortBy);

  res.status(httpStatus.OK).send(result);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const updateBody = UserUpdateSchema.parse(req.body);

  const user = await userService.updateUserById(userId, updateBody);

  res.status(httpStatus.OK).send(user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  await userService.deleteUserById(userId);

  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  getUser,
  getUsers,
  updateUser,
  deleteUser
};
