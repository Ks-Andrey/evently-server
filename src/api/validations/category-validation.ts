import { z } from 'zod';

const uuidSchema = z.string().uuid();

export const getCategoryByIdSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Category name is required').max(100, 'Category name is too long'),
    }),
});

export const editCategorySchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    body: z.object({
        name: z.string().min(1, 'Category name is required').max(100, 'Category name is too long'),
    }),
});

export const deleteCategorySchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});
