import express from 'express';
import { programController } from '../../controllers';

const router = express.Router();

router.post('/', programController.createProgram);

router.get('/', programController.getPrograms);

router.get('/:programId', programController.getProgram);

router.patch('/:programId', programController.updateProgram);

router.delete('/:programId', programController.deleteProgram);

export default router;
