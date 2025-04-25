import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Name is required'),
  email: z.string().email().min(3, 'Email is required'),
  role: z.nativeEnum(UserRole, { message: 'Role must be either ADMIN or USER' }).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  password: z.string().min(8, 'Password is required')
});

export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  role: true
});

export const UserUpdateSchema = UserSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  role: true
});

export const userLoginSchema = UserSchema.pick({
  email: true,
  password: true
});

export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
