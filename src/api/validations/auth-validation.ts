import { z } from 'zod';

const uuidSchema = z.string().uuid();

export const registerSchema = z.object({
    body: z.object({
        userTypeId: uuidSchema,
        username: z.string().min(1, 'Username is required').max(100, 'Username is too long'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const confirmEmailSchema = z.object({
    body: z.object({
        token: uuidSchema,
    }),
});
