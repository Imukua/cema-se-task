import express from 'express';
import { enrollmentController } from '../../controllers';

const router = express.Router();

router.post('/', enrollmentController.createEnrollment);

router.get('/client/:clientId', enrollmentController.getClientEnrollments);

router.patch('/:enrollmentId', enrollmentController.updateEnrollment);

router.delete('/:enrollmentId', enrollmentController.deleteEnrollment);

export default router;
