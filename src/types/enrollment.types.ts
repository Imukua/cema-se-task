import { z } from 'zod';
import { EnrollmentStatus } from '@prisma/client'; // Assuming enrollmentStatus.types.ts is in the same directory

export const EnrollmentSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  programId: z.string().uuid(),
  enrolledAt: z.date(),
  status: z.nativeEnum(EnrollmentStatus, {
    message: 'Status must be either active, complete, or dropped'
  }),
  notes: z.string().nullable()
});

export const EnrollmentCreateSchema = EnrollmentSchema.omit({
  id: true,
  enrolledAt: true
});

export type Enrollment = z.infer<typeof EnrollmentSchema>;
export type EnrollmentCreate = z.infer<typeof EnrollmentCreateSchema>;
