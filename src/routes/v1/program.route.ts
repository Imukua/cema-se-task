import express from 'express';
import { programController } from '../../controllers';
import auth from '../../middleware/auth';
import {
  HealthProgramCreateSchema,
  HealthProgramUpdateSchema
} from '../../types/healthProgram.types';
import validate from '../../middleware/validate';

const router = express.Router();

router.use(auth());

router.post('/', validate(HealthProgramCreateSchema), programController.createProgram);

router.get('/', programController.getPrograms);

router.get('/:programId', programController.getProgram);

router.patch('/:programId', validate(HealthProgramUpdateSchema), programController.updateProgram);

router.delete('/:programId', programController.deleteProgram);

export default router;
