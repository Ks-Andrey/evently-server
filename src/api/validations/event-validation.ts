import { z } from 'zod';

const uuidSchema = z.string().uuid();

const dateSchema = z
    .string()
    .refine(
        (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        },
        { message: 'Invalid date format' },
    )
    .optional();

export const getEventsSchema = z.object({
    query: z.object({
        categoryId: uuidSchema.optional(),
        dateFrom: z
            .string()
            .refine(
                (val) => {
                    const date = new Date(val);
                    return !isNaN(date.getTime());
                },
                { message: 'Invalid date format' },
            )
            .optional(),
        dateTo: z
            .string()
            .refine(
                (val) => {
                    const date = new Date(val);
                    return !isNaN(date.getTime());
                },
                { message: 'Invalid date format' },
            )
            .optional(),
        keyword: z.string().optional(),
    }),
});

export const getEventByIdSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const getEventSubscribersSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const createEventSchema = z.object({
    body: z.object({
        categoryId: uuidSchema,
        title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
        description: z.string().min(1, 'Description is required'),
        date: z.string().refine(
            (val) => {
                const date = new Date(val);
                return !isNaN(date.getTime());
            },
            { message: 'Invalid date format' },
        ),
        location: z.string().min(1, 'Location is required').max(200, 'Location is too long'),
    }),
});

export const editEventSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    body: z.object({
        title: z.string().min(1).max(200).optional(),
        description: z.string().optional(),
        date: dateSchema.optional(),
        location: z.string().min(1).max(200).optional(),
        categoryId: uuidSchema.optional(),
    }),
});

export const deleteEventSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const notifySubscribersSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    body: z.object({
        message: z.string().min(1, 'Message is required'),
    }),
});

export const addGalleryPhotosSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const deleteGalleryPhotoSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    body: z.object({
        photoUrl: z.string().url('Invalid photo URL'),
    }),
});
