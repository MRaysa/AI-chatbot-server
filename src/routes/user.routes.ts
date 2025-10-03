import { Router, type Request, type Response } from 'express';
import userController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

// All routes require authentication
router.use(authMiddleware);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

export default router;

