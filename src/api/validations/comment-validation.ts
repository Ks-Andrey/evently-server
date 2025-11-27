import { z } from 'zod';

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
        text: z.string().min(1, 'Comment text is required').max(1000, 'Comment is too long'),
    }),
});

export const editCommentSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    body: z.object({
        text: z.string().min(1, 'Comment text is required').max(1000, 'Comment is too long'),
    }),
});

export const deleteCommentSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});
