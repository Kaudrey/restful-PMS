// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Prisma unique constraint error (example: email already exists)
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: `Duplicate entry: ${err.meta?.target?.join(', ')}`,
    });
  }

  // Any custom error you might throw
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message || 'Something went wrong',
    });
  }

  // Fallback to 500
  console.error('Unhandled error:', err);
  return res.status(500).json({ message: 'Internal Server Error' });
};
