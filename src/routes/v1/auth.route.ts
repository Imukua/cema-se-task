import express from 'express';
import { authController } from '../../controllers';
import validate from '../../middleware/validate';
import { UserCreateSchema, userLoginSchema, userRefreshToken } from '../../types/user.types';

const router = express.Router();

router.post('/register', validate(UserCreateSchema), authController.register);

router.post('/login', validate(userLoginSchema), authController.login);

router.post('/refresh', validate(userRefreshToken), authController.refreshTokens);

export default router;
