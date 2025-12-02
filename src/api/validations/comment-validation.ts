import { z } from 'zod';

import { ERROR_MESSAGES } from '@common/constants/errors';

const uuidSchema = z.string().uuid();

export const getCommentsByEventSchema = z.object({
    params: z.object({
        eventId: uuidSchema,
    }),
});

export const getCommentsByUserSchema = z.object({
    params: z.object({
        userId: uuidSchema,
    }),
});

export const createCommentSchema = z.object({
    body: z.object({
        eventId: uuidSchema,
        text: z
            .string()
            .min(1, ERROR_MESSAGES.api.comment.textRequired)
            .max(1000, ERROR_MESSAGES.api.comment.textTooLong),
    }),
});

export const editCommentSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    body: z.object({
        text: z
            .string()
            .min(1, ERROR_MESSAGES.api.comment.textRequired)
            .max(1000, ERROR_MESSAGES.api.comment.textTooLong),
    }),
});

export const deleteCommentSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});
