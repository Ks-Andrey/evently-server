import { Request, Response, NextFunction } from 'express';

import { AccessDeniedException } from '@application/common';

import { createErrorResponse } from '../common/utils/error-handler';

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            const errorResponse = createErrorResponse(new AccessDeniedException(), 401);
            return res.status(401).json(errorResponse);
        }

        const hasRole = allowedRoles.some((role) => user.role === role);

        if (!hasRole) {
            const errorResponse = createErrorResponse(new AccessDeniedException(), 403);
            return res.status(403).json(errorResponse);
        }

        next();
    };
};
