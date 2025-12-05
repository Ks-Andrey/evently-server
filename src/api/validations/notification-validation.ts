import { z } from 'zod';

import { dateQuerySchema, paginationQuerySchema } from './common-schemas';

export const getUserNotificationsSchema = z.object({
    query: paginationQuerySchema.extend({
        dateFrom: dateQuerySchema,
        dateTo: dateQuerySchema,
    }),
});
