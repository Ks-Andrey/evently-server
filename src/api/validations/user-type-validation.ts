import { z } from 'zod';

import { ERROR_MESSAGES } from '@common/constants/errors';
import { Roles } from '@common/constants/roles';

const uuidSchema = z.string().uuid();
const roleSchema = z.enum([Roles.ADMIN, Roles.ORGANIZER, Roles.USER]);

export const getUserTypeByIdSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const createUserTypeSchema = z.object({
    body: z.object({
        typeName: z
            .string()
            .min(1, ERROR_MESSAGES.api.userType.nameRequired)
            .max(100, ERROR_MESSAGES.api.userType.nameTooLong),
        role: roleSchema.optional().default(Roles.USER),
    }),
});

export const editUserTypeSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    body: z.object({
        typeName: z
            .string()
            .min(1, ERROR_MESSAGES.api.userType.nameRequired)
            .max(100, ERROR_MESSAGES.api.userType.nameTooLong),
        role: roleSchema,
    }),
});

export const deleteUserTypeSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});
