import express from 'express';
import { enrollmentController } from '../../controllers';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { EnrollmentCreateSchema, EnrollmentUpdateSchema } from '../../types/enrollment.types';

const router = express.Router();

router.use(auth());

router.post('/', validate(EnrollmentCreateSchema), enrollmentController.createEnrollment);
router.get('/', enrollmentController.searchEnrollments);
router.get('/client/:clientId', enrollmentController.getClientEnrollments);
router.patch(
  '/:enrollmentId',
  validate(EnrollmentUpdateSchema),
  enrollmentController.updateEnrollment
);

router.delete('/:enrollmentId', enrollmentController.deleteEnrollment);

export default router;
