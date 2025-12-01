import { z } from 'zod';

export const getCoordinatesByLocationSchema = z.object({
    query: z.object({
        location: z.string().min(1, 'Location cannot be empty'),
    }),
});
