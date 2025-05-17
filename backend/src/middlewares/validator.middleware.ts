// src/middlewares/validator.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateDto = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: result.error.errors.map(err => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }

  req.body = result.data; // Clean data
  next();
};
