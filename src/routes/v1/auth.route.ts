import express from 'express';
import { authController } from '../../controllers';

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/refresh-tokens', authController.refreshTokens);

export default router;
