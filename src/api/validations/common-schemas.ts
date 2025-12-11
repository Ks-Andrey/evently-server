import { z } from 'zod';

export const paginationQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => {
            if (!val) return 1;
            const parsed = Number.parseInt(val, 10);
            return Number.isNaN(parsed) ? 1 : parsed;
        })
        .pipe(z.number().int().min(1)),
    pageSize: z
        .string()
        .optional()
        .transform((val) => {
            if (!val) return 10;
            const parsed = Number.parseInt(val, 10);
            return Number.isNaN(parsed) ? 10 : parsed;
        })
        .pipe(z.number().int().min(1).max(100)),
});

export const dateQuerySchema = z
    .string()
    .refine(
        (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        },
        { message: 'Invalid date format' },
    )
    .optional();

export const searchQuerySchema = z.string().max(200).optional();
