import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../config/db';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

interface AuthRequest extends Request {
  user?: {
    id: string; // Changed from number to string
    role: string;
  };
}

// Authenticate any logged-in user
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }; // Changed from number to string
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

// Authorize only admin
export const checkAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'You are not an admin (token missing)' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }; // Changed from number to string

    if (!decoded?.id) {
      return res.status(401).json({ message: 'Invalid token: no user ID found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ message: 'You are not logged in' });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({ message: "You're not allowed to access this resource, i:e you're not the admin" });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
