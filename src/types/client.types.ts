import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  dob: z.coerce.date(),
  gender: z.string(),
  contact: z.string(),
  notes: z.string().nullable(),
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
export type RecentClient = {
  id: string;
  fullName: string;
  createdAt: Date;
};

export type Statistics = {
  client: {
    total: number;
    recent: RecentClient[];
  };
  programs: {
    total: number;
  };
  enrollments: {
    total: number;
    distribution: {
      active: number;
      completed: number;
      dropped: number;
    };
  };
};
export type Client = z.infer<typeof ClientSchema>;
export type ClientCreate = z.infer<typeof ClientCreateSchema>;
export type ClientUpdate = z.infer<typeof ClientUpdateSchema>;
