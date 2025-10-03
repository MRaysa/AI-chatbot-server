import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, message: string, data?: any, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  static created(res: Response, message: string, data?: any) {
    return this.success(res, message, data, 201);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden') {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Not found') {
    return this.error(res, message, 404);
  }

  static badRequest(res: Response, message: string, errors?: any) {
    return this.error(res, message, 400, errors);
  }
}
