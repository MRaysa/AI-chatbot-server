import { Request, Response, NextFunction } from 'express';
import { verifyFirebaseToken } from '../config/firebase';
import { ApiResponse } from '../utils/apiResponse';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'No token provided');
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return ApiResponse.unauthorized(res, 'Invalid token format');
    }

    // Verify token with Firebase
    const decodedToken = await verifyFirebaseToken(token);

    // Attach user info to request
    req.user = decodedToken;

    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    return ApiResponse.unauthorized(res, 'Invalid or expired token');
  }
};

// Optional: Middleware to check if user is authenticated but don't throw error
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await verifyFirebaseToken(token);

      req.user = decodedToken;
    }
  } catch (error) {
    // Don't throw error, just continue without user
    console.log('Optional auth failed, continuing without user');
  }

  next();
};
