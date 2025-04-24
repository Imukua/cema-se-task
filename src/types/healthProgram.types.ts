import { z } from 'zod';

export const HealthProgramSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const HealthProgramCreateSchema = HealthProgramSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const HealthProgramUpdateSchema = HealthProgramSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type HealthProgram = z.infer<typeof HealthProgramSchema>;
export type HealthProgramCreate = z.infer<typeof HealthProgramCreateSchema>;
export type HealthProgramUpdate = z.infer<typeof HealthProgramUpdateSchema>;
