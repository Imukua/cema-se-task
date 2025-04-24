import { Request, Response } from 'express';
import logger from '../config/logger';

const createProgram = (req: Request, res: Response) => {
  logger.info('Mock Program Controller: createProgram');
  res.status(200).json({ message: 'Mock createProgram endpoint hit', body: req.body });
};

const getPrograms = (req: Request, res: Response) => {
  logger.info('Mock Program Controller: getPrograms');
  res.status(200).json({ message: 'Mock getPrograms endpoint hit', query: req.query });
};

const getProgram = (req: Request, res: Response) => {
  logger.info('Mock Program Controller: getProgram');
  res.status(200).json({ message: 'Mock getProgram endpoint hit', params: req.params });
};

const updateProgram = (req: Request, res: Response) => {
  logger.info('Mock Program Controller: updateProgram');
  res
    .status(200)
    .json({ message: 'Mock updateProgram endpoint hit', params: req.params, body: req.body });
};

const deleteProgram = (req: Request, res: Response) => {
  logger.info('Mock Program Controller: deleteProgram');
  res.status(200).json({ message: 'Mock deleteProgram endpoint hit', params: req.params });
};

export default {
  createProgram,
  getPrograms,
  getProgram,
  updateProgram,
  deleteProgram
};
