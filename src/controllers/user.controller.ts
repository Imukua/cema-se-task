import { Request, Response } from 'express';
import logger from '../config/logger';

const getUser = (req: Request, res: Response) => {
  logger.info('Mock User Controller: getUser');
  const userId = req.params.userId;
  res
    .status(200)
    .json({ message: `Mock getUser endpoint hit for user ID: ${userId}`, params: req.params });
};

const getUsers = (req: Request, res: Response) => {
  logger.info('Mock User Controller: getUsers');
  res
    .status(200)
    .json({ message: 'Mock getUsers endpoint hit', query: req.query, user: (req as any).user });
};

const updateUser = (req: Request, res: Response) => {
  logger.info('Mock User Controller: updateUser');
  const userId = req.params.userId;
  const updateBody = req.body;
  res.status(200).json({
    message: `Mock updateUser endpoint hit for user ID: ${userId}`,
    params: req.params,
    body: updateBody,
    user: (req as any).user
  });
};

const deleteUser = (req: Request, res: Response) => {
  logger.info('Mock User Controller: deleteUser');
  const userId = req.params.userId;
  res.status(200).json({
    message: `Mock deleteUser endpoint hit for user ID: ${userId}`,
    params: req.params,
    user: (req as any).user
  });
};

export default {
  getUser,
  getUsers,
  updateUser,
  deleteUser
};
