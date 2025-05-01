import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(20, 'Min 20 characters').max(60, 'Max 60 characters'),
  email: z.string().email('Invalid email'),
  address: z.string().max(400, 'Max 400 characters'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .max(16, 'Maximum 16 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[^a-zA-Z0-9]/, 'Must include one special character'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .max(16, 'Maximum 16 characters'),
    role: z.enum(["USER", "ADMIN", "STORE_OWNER"], { message: "Invalid role selected" }),
});
