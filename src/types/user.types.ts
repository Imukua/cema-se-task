import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(UserRole, { message: 'Role must be either admin, seller, or buyer' }),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const UserUpdateSchema = UserSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
