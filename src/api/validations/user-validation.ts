import { z } from 'zod';

import { ERROR_MESSAGES } from '@common/constants/errors';

import { paginationQuerySchema, searchQuerySchema } from './common-schemas';

const uuidSchema = z.string().uuid();

export const getUserByIdSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const getUserByNameSchema = z.object({
    params: z.object({
        username: z.string().min(1, ERROR_MESSAGES.api.user.usernameRequired),
    }),
});

export const getUserByEmailSchema = z.object({
    params: z.object({
        email: z.string().email(ERROR_MESSAGES.api.user.emailInvalid),
    }),
});

export const editMeSchema = z.object({
    body: z.object({
        username: z.string().min(1).max(100).optional(),
        personalData: z.string().max(1000).optional(),
    }),
});

export const editUserSchema = z.object({
    body: z.object({
        username: z.string().min(1).max(100).optional(),
        personalData: z.string().max(1000).optional(),
    }),
    params: z.object({
        id: uuidSchema,
    }),
});

export const editEmailSchema = z.object({
    body: z.object({
        password: z.string().min(1, ERROR_MESSAGES.api.user.passwordRequired),
        newEmail: z.string().email(ERROR_MESSAGES.api.user.emailInvalid),
    }),
});

export const editPasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1, ERROR_MESSAGES.api.user.oldPasswordRequired),
        newPassword: z
            .string()
            .min(8, ERROR_MESSAGES.api.user.newPasswordMinLength)
            .max(128, ERROR_MESSAGES.api.user.newPasswordMaxLength),
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

export const getAllUsersSchema = z.object({
    query: paginationQuerySchema.extend({
        search: searchQuerySchema,
    }),
});

export const getUserSubscriptionsSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    query: paginationQuerySchema.extend({
        search: searchQuerySchema,
    }),
});

export const getMySubscriptionsSchema = z.object({
    query: paginationQuerySchema.extend({
        search: searchQuerySchema,
    }),
});
