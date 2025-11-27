import { z } from 'zod';

const uuidSchema = z.string().uuid();

export const getUserByIdSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const getUserByNameSchema = z.object({
    params: z.object({
        username: z.string().min(1, 'Username is required'),
    }),
});

export const getUserByEmailSchema = z.object({
    params: z.object({
        email: z.string().email('Invalid email format'),
    }),
});

export const editUserSchema = z.object({
    body: z.object({
        username: z.string().min(1).max(100).optional(),
        personalData: z.string().optional(),
        userId: uuidSchema.optional(),
    }),
});

export const editEmailSchema = z.object({
    body: z.object({
        password: z.string().min(1, 'Password is required'),
        newEmail: z.string().email('Invalid email format'),
        userId: uuidSchema.optional(),
    }),
});

export const editPasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1, 'Old password is required'),
        newPassword: z.string().min(8, 'New password must be at least 8 characters'),
        userId: uuidSchema.optional(),
    }),
});

export const deleteUserSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const toggleBlockUserSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const subscribeToEventSchema = z.object({
    body: z.object({
        eventId: uuidSchema,
    }),
});

export const unsubscribeFromEventSchema = z.object({
    body: z.object({
        eventId: uuidSchema,
    }),
});

export const uploadAvatarSchema = z.object({
    body: z.object({
        userId: uuidSchema.optional(),
    }),
});

export const deleteAvatarSchema = z.object({
    body: z.object({
        userId: uuidSchema.optional(),
    }),
});
