import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authValidation } from '../middlewares/validation.middleware';

const router = Router();

/**
 * @route   POST /api/auth/verify
 * @desc    Verify Firebase token and sign in/sign up user
 * @access  Public
 */
router.post('/verify', authValidation.verifyToken, authController.verifyToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * @route   POST /api/auth/signout
 * @desc    Sign out user
 * @access  Private
 */
router.post('/signout', authMiddleware, authController.signOut);

export default router;
