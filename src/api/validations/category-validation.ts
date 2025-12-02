import { z } from 'zod';

import { ERROR_MESSAGES } from '@common/constants/errors';

const uuidSchema = z.string().uuid();

export const getCategoryByIdSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const createCategorySchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, ERROR_MESSAGES.api.category.nameRequired)
            .max(100, ERROR_MESSAGES.api.category.nameTooLong),
    }),
});

export const editCategorySchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    body: z.object({
        name: z
            .string()
            .min(1, ERROR_MESSAGES.api.category.nameRequired)
            .max(100, ERROR_MESSAGES.api.category.nameTooLong),
    }),
});

export const deleteCategorySchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});
