import { Request, Response, NextFunction } from 'express';

import { AccessDeniedException } from '@application/common';
import { ITokenManager } from '@application/services/auth';
import { log } from '@common/utils/logger';

import { createErrorResponse } from '../common/utils/error-handler';

export const authMiddleware = (tokenManager: ITokenManager) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer ')) {
            const errorResponse = createErrorResponse(new AccessDeniedException(), 401);
            return res.status(errorResponse.status).json(errorResponse);
        }

        const token = header.split(' ')[1];

        try {
            const user = await tokenManager.verifyToken(token, 'access');
            req.user = user;
            log.debug('User authenticated', { userId: user.userId, role: user.role });
            next();
        } catch (error: unknown) {
            log.warn('Authentication failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            const errorResponse = createErrorResponse(error, 401);
            return res.status(errorResponse.status).json(errorResponse);
        }
    };
};
