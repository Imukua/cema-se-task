import express from 'express';
import { userController } from '../../controllers';

const router = express.Router();

router.get('/:userId', userController.getUser);

router.get('/', userController.getUsers);

router.patch('/:userId', userController.updateUser);

router.delete('/:userId', userController.deleteUser);

export default router;
