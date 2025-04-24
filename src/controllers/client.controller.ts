import { Request, Response } from 'express';
import logger from '../config/logger';

const createClient = (req: Request, res: Response) => {
  logger.info('Mock Client Controller: createClient');
  res
    .status(200)
    .json({ message: 'Mock createClient endpoint hit', body: req.body, user: (req as any).user });
};

const searchClients = (req: Request, res: Response) => {
  logger.info('Mock Client Controller: searchClients');
  res.status(200).json({ message: 'Mock searchClients endpoint hit', query: req.query });
};

const getClientProfile = (req: Request, res: Response) => {
  logger.info('Mock Client Controller: getClientProfile');
  res.status(200).json({ message: 'Mock getClientProfile endpoint hit', params: req.params });
};

const updateClient = (req: Request, res: Response) => {
  logger.info('Mock Client Controller: updateClient');
  res
    .status(200)
    .json({ message: 'Mock updateClient endpoint hit', params: req.params, body: req.body });
};

const deleteClient = (req: Request, res: Response) => {
  logger.info('Mock Client Controller: deleteClient');
  res.status(200).json({ message: 'Mock deleteClient endpoint hit', params: req.params });
};

export default {
  createClient,
  searchClients,
  getClientProfile,
  updateClient,
  deleteClient
};
