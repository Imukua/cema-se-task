import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('3000'),
  JWT_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION_MINUTES: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('30'),
  JWT_REFRESH_EXPIRATION_DAYS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('30'),
});

const parsedEnv = envVarsSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Config validation error: ${parsedEnv.error.format()}`);
}

const envVars = parsedEnv.data;

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
};