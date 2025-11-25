import { Request, Response, NextFunction } from 'express';

import { ApplicationErrorCodes, ApplicationException } from '@application/common';
import { errorMessages } from '@common/config/errors';

import { createErrorResponse } from '../utils/error-handler';

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            const errorResponse = createErrorResponse(
                new ApplicationException(errorMessages.domain.common.accessDenied, ApplicationErrorCodes.ACCESS_DENIED),
                401,
            );
            return res.status(401).json(errorResponse);
        }

        const hasRole = allowedRoles.some((role) => user.role === role);

        if (!hasRole) {
            const errorResponse = createErrorResponse(
                new ApplicationException(errorMessages.domain.common.accessDenied, ApplicationErrorCodes.ACCESS_DENIED),
                403,
            );
            return res.status(403).json(errorResponse);
        }

        next();
    };
};
