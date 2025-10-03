import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ApiResponse } from '../utils/apiResponse';

// Validation error handler
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return ApiResponse.badRequest(res, 'Validation failed', errors.array());
  }

  next();
};

// Validation rules
export const authValidation = {
  verifyToken: [
    body('idToken').notEmpty().withMessage('ID token is required'),
    validate,
  ],
};
