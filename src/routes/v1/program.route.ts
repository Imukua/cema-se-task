import express from 'express';
import { programController } from '../../controllers';
import auth from '../../middleware/auth';

const router = express.Router();

router.use(auth());

router.post('/', programController.createProgram);

router.get('/', programController.getPrograms);

router.get('/:programId', programController.getProgram);

router.patch('/:programId', programController.updateProgram);

router.delete('/:programId', programController.deleteProgram);

export default router;
