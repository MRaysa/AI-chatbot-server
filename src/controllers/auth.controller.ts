import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

export class AuthController {
  /**
   * @desc    Verify Firebase token and sign in/sign up user
   * @route   POST /api/auth/verify
   * @access  Public
   */
  async verifyToken(req: Request, res: Response): Promise<Response> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return ApiResponse.badRequest(res, 'ID token is required');
      }

      const user = await authService.verifyAndSyncUser(idToken);

      return ApiResponse.success(res, 'Authentication successful', {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: user.provider,
        },
      });
    } catch (error: any) {
      console.error('Token verification error:', error);
      return ApiResponse.unauthorized(res, error.message || 'Authentication failed');
    }
  }

  /**
   * @desc    Get current user profile
   * @route   GET /api/auth/me
   * @access  Private
   */
  async getCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const uid = (req as any).user?.uid;

      if (!uid) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      const user = await authService.getUserByUid(uid);

      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }

      return ApiResponse.success(res, 'User retrieved successfully', {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: user.provider,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        },
      });
    } catch (error: any) {
      console.error('Get current user error:', error);
      return ApiResponse.error(res, error.message || 'Failed to get user');
    }
  }

  /**
   * @desc    Sign out user (client-side handles Firebase sign out)
   * @route   POST /api/auth/signout
   * @access  Private
   */
  async signOut(req: Request, res: Response): Promise<Response> {
    try {
      // In Firebase, sign out is primarily handled on the client side
      // This endpoint is here for logging or additional server-side cleanup if needed

      return ApiResponse.success(res, 'Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      return ApiResponse.error(res, error.message || 'Sign out failed');
    }
  }
}

export default new AuthController();
