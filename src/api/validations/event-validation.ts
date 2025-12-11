import { z } from 'zod';

import { ERROR_MESSAGES } from '@common/constants/errors';

import { dateQuerySchema, paginationQuerySchema, searchQuerySchema } from './common-schemas';

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
    query: paginationQuerySchema.extend({
        categoryId: uuidSchema.optional(),
        dateFrom: dateQuerySchema,
        dateTo: dateQuerySchema,
        keyword: searchQuerySchema,
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
    query: paginationQuerySchema.extend({
        search: searchQuerySchema,
    }),
});

export const getOrganizerEventsSchema = z.object({
    query: paginationQuerySchema.extend({
        dateFrom: dateQuerySchema,
        dateTo: dateQuerySchema,
        keyword: searchQuerySchema,
    }),
});

export const createEventSchema = z.object({
    body: z.object({
        categoryId: uuidSchema,
        title: z.string().min(1, ERROR_MESSAGES.api.event.titleRequired).max(60, ERROR_MESSAGES.api.event.titleTooLong),
        description: z
            .string()
            .min(1, ERROR_MESSAGES.api.event.descriptionRequired)
            .max(2000, ERROR_MESSAGES.api.event.descriptionTooLong),
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
            title: z.string().min(1).max(60, ERROR_MESSAGES.api.event.titleTooLong).optional(),
            description: z.string().min(1).max(2000, ERROR_MESSAGES.api.event.descriptionTooLong).optional(),
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
            if (location) {
                return latitude && longitude;
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
        message: z
            .string()
            .min(1, ERROR_MESSAGES.api.event.messageRequired)
            .max(500, ERROR_MESSAGES.api.event.messageTooLong),
    }),
});

export const addGalleryPhotosSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const deleteGalleryPhotoSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        photoUrl: z.string().nonempty(ERROR_MESSAGES.api.event.photoUrlInvalid),
    }),
});
