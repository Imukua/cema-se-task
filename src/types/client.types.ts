import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  dob: z.date(),
  gender: z.string(),
  contact: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid()
});

export const ClientCreateSchema = ClientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const ClientUpdateSchema = ClientSchema.partial().omit({
  createdAt: true,
  updatedAt: true,
  userId: true
});
export type Client = z.infer<typeof ClientSchema>;
export type ClientCreate = z.infer<typeof ClientCreateSchema>;
export type ClientUpdate = z.infer<typeof ClientUpdateSchema>;
