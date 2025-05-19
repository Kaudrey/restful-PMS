import { Request, Response,NextFunction } from 'express';
import prisma from '../config/db';
import { hashPassword, comparePasswords } from '../utils/hash';
import { Role } from '@prisma/client';
import { generateToken } from '../utils/token';
import { z } from 'zod';
import {AuthRequest} from '../middlewares/auth.middleware';

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Include other relations if needed, for example:
        // vehicles: true,
        // parkingRequests: true
      },
      // Alternatively, you can use exclude to remove sensitive fields:
      // select: { password: false, ... }
    });

    res.status(200).json(allUsers);
  } catch (err) {
    next(err);
  }
};

