import { z } from 'zod';

import { ERROR_MESSAGES } from '@common/constants/errors';

const uuidSchema = z.string().uuid();

const strongPasswordSchema = z
    .string()
    .min(8, ERROR_MESSAGES.api.auth.passwordMinLength)
    .regex(/[A-Z]/, ERROR_MESSAGES.api.auth.passwordUppercase)
    .regex(/[a-z]/, ERROR_MESSAGES.api.auth.passwordLowercase)
    .regex(/[0-9]/, ERROR_MESSAGES.api.auth.passwordNumber)
    .regex(/[^A-Za-z0-9]/, ERROR_MESSAGES.api.auth.passwordSpecialChar);

export const registerSchema = z.object({
    body: z.object({
        userTypeId: uuidSchema,
        username: z
            .string()
            .min(1, ERROR_MESSAGES.api.auth.usernameRequired)
            .max(100, ERROR_MESSAGES.api.auth.usernameTooLong),
        email: z.string().email(ERROR_MESSAGES.api.auth.emailInvalid),
        password: strongPasswordSchema,
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(ERROR_MESSAGES.api.auth.emailInvalid),
        password: z.string().min(1, ERROR_MESSAGES.api.auth.passwordRequired),
    }),
});

export const confirmEmailSchema = z.object({
    query: z.object({
        token: uuidSchema,
    }),
});
