import { Request, Response } from 'express';
import logger from '../config/logger';

const createEnrollment = (req: Request, res: Response) => {
  logger.info('Mock Enrollment Controller: createEnrollment');
  res.status(200).json({ message: 'Mock createEnrollment endpoint hit', body: req.body });
};

const getClientEnrollments = (req: Request, res: Response) => {
  logger.info('Mock Enrollment Controller: getClientEnrollments');
  res.status(200).json({ message: 'Mock getClientEnrollments endpoint hit', params: req.params });
};

const updateEnrollment = (req: Request, res: Response) => {
  logger.info('Mock Enrollment Controller: updateEnrollment');
  res
    .status(200)
    .json({ message: 'Mock updateEnrollment endpoint hit', params: req.params, body: req.body });
};

const deleteEnrollment = (req: Request, res: Response) => {
  logger.info('Mock Enrollment Controller: deleteEnrollment');
  res.status(200).json({ message: 'Mock deleteEnrollment endpoint hit', params: req.params });
};

export default {
  createEnrollment,
  getClientEnrollments,
  updateEnrollment,
  deleteEnrollment
};
