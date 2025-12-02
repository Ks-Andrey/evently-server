import { z } from 'zod';

import { ERROR_MESSAGES } from '@common/constants/errors';

export const getCoordinatesByLocationSchema = z.object({
    query: z.object({
        location: z.string().min(1, ERROR_MESSAGES.api.geocoder.locationRequired),
    }),
});
