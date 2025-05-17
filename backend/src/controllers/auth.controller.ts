import { Request, Response } from 'express';
import prisma from '../config/db';
import { hashPassword, comparePasswords } from '../utils/hash';
import { Role } from '@prisma/client';
import { generateToken } from '../utils/token';
import { z } from 'zod';
// Register schema only
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email('Email must be a valid email address'),
  password: z.string()
    .min(6)
    .max(16)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
      message: 'Password must have at least 6 characters, one symbol, one number, and one uppercase letter.'
    }),
  confirmPassword: z.string(),
  role: z.nativeEnum(Role).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const signup = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.errors.map((e) => ({ field: e.path[0], message: e.message }))
      });
    }
    const { name, email, password, role } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({ data: { name, email, password: hashed, role } });
    console.log('User created:', JSON.stringify(user, null, 2));
    return res.status(201).json({ message: 'User created', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const match = await comparePasswords(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });
    const token = generateToken(user.id.toString());
    if (!token) return res.status(500).json({ message: 'Token generation failed' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' });
  } finally {
    console.log('Login attempt:', JSON.stringify(req.body, null, 2));
  }
}