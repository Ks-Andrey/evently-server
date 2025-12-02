import { z } from 'zod';

import { ERROR_MESSAGES } from '@common/constants/errors';

const uuidSchema = z.string().uuid();

const dateSchema = z
    .string()
    .refine(
        (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        },
        { message: ERROR_MESSAGES.api.event.dateInvalid },
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
                { message: ERROR_MESSAGES.api.event.dateInvalid },
            )
            .optional(),
        dateTo: z
            .string()
            .refine(
                (val) => {
                    const date = new Date(val);
                    return !isNaN(date.getTime());
                },
                { message: ERROR_MESSAGES.api.event.dateInvalid },
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
        title: z
            .string()
            .min(1, ERROR_MESSAGES.api.event.titleRequired)
            .max(200, ERROR_MESSAGES.api.event.titleTooLong),
        description: z.string().min(1, ERROR_MESSAGES.api.event.descriptionRequired),
        date: z.string().refine(
            (val) => {
                const date = new Date(val);
                return !isNaN(date.getTime());
            },
            { message: ERROR_MESSAGES.api.event.dateInvalid },
        ),
        location: z
            .string()
            .min(1, ERROR_MESSAGES.api.event.locationRequired)
            .max(200, ERROR_MESSAGES.api.event.locationTooLong),
        latitude: z
            .number()
            .min(-90, ERROR_MESSAGES.api.event.latitudeOutOfRange)
            .max(90, ERROR_MESSAGES.api.event.latitudeOutOfRange),
        longitude: z
            .number()
            .min(-180, ERROR_MESSAGES.api.event.longitudeOutOfRange)
            .max(180, ERROR_MESSAGES.api.event.longitudeOutOfRange),
    }),
});

export const editEventSchema = z
    .object({
        params: z.object({
            id: uuidSchema,
        }),
        body: z.object({
            title: z.string().min(1).max(200).optional(),
            description: z.string().optional(),
            date: dateSchema.optional(),
            location: z.string().min(1).max(200).optional(),
            latitude: z.number().min(-90).max(90).optional(),
            longitude: z.number().min(-180).max(180).optional(),
            categoryId: uuidSchema.optional(),
        }),
    })
    .refine(
        (data) => {
            const { location, latitude, longitude } = data.body;
            if (location !== undefined) {
                return latitude !== undefined && longitude !== undefined;
            }
            return true;
        },
        {
            message: ERROR_MESSAGES.api.event.locationRequiresCoordinates,
            path: ['body', 'location'],
        },
    );

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
        message: z.string().min(1, ERROR_MESSAGES.api.event.messageRequired),
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
        photoUrl: z.string().url(ERROR_MESSAGES.api.event.photoUrlInvalid),
    }),
});
