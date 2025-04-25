import express from 'express';
import { userController } from '../../controllers';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { UserUpdateSchema } from '../../types/user.types';

const router = express.Router();

router.use(auth());
router.get('/:userId', userController.getUser);

router.get('/', userController.getUsers);

router.patch('/:userId', validate(UserUpdateSchema), userController.updateUser);

router.delete('/:userId', userController.deleteUser);

export default router;
