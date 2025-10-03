import { Request, Response } from 'express';
import User from '../models/User.model';
import { ApiResponse } from '../utils/apiResponse';

export class UserController {
  /**
   * @desc    Update user profile
   * @route   PUT /api/users/profile
   * @access  Private
   */
  async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const uid = (req as any).user?.uid;

      if (!uid) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      const { displayName, photoURL } = req.body;

      // Validate inputs
      if (!displayName && !photoURL) {
        return ApiResponse.badRequest(res, 'At least one field (displayName or photoURL) is required');
      }

      // Update user in database
      const updateData: any = {};
      if (displayName) updateData.displayName = displayName;
      if (photoURL) updateData.photoURL = photoURL;

      const user = await User.findOneAndUpdate(
        { uid },
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }

      return ApiResponse.success(res, 'Profile updated successfully', {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: user.provider,
        },
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      return ApiResponse.error(res, error.message || 'Failed to update profile');
    }
  }

  /**
   * @desc    Get user profile
   * @route   GET /api/users/profile
   * @access  Private
   */
  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const uid = (req as any).user?.uid;

      if (!uid) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      const user = await User.findOne({ uid });

      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }

      return ApiResponse.success(res, 'Profile retrieved successfully', {
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
      console.error('Get profile error:', error);
      return ApiResponse.error(res, error.message || 'Failed to get profile');
    }
  }
}

export default new UserController();
