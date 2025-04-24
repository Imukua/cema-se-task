import { Request, Response } from 'express';
import logger from '../config/logger';

const register = (req: Request, res: Response) => {
  logger.info('Mock Auth Controller: register');
  res.status(200).json({ message: 'Mock register endpoint hit', body: req.body });
};

const login = (req: Request, res: Response) => {
  logger.info('Mock Auth Controller: login');
  res.status(200).json({ message: 'Mock login endpoint hit', body: req.body });
};

const refreshTokens = (req: Request, res: Response) => {
  logger.info('Mock Auth Controller: refreshTokens');
  res.status(200).json({ message: 'Mock refresh-tokens endpoint hit', body: req.body });
};

export default {
  register,
  login,
  refreshTokens
};
