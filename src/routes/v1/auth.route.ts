import express from 'express';
import { authController } from '../../controllers';
import validate from '../../middleware/validate';
import { UserCreateSchema } from '../../types/user.types';

const router = express.Router();

router.post('/register', validate(UserCreateSchema), authController.register);

router.post('/login', authController.login);

router.post('/refresh-tokens', authController.refreshTokens);

export default router;
