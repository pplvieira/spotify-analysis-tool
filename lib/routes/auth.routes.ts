import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/login', AuthController.login);
router.get('/callback', AuthController.callback);

// Protected routes
router.post('/logout', requireAuth, AuthController.logout);
router.get('/session', AuthController.getCurrentSession);
router.post('/refresh', AuthController.refreshToken);

export default router;
