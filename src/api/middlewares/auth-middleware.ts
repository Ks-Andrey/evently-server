import { Request, Response, NextFunction } from 'express';

import { NotAuthenticatedException } from '@application/common';
import { ITokenManager } from '@application/services/auth';
import { log } from '@common/utils/logger';

import { createErrorResponse } from '../common/utils/error-handler';

export const authMiddleware = (tokenManager: ITokenManager) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer ')) {
            const errorResponse = createErrorResponse(new NotAuthenticatedException());
            return res.status(errorResponse.status).json(errorResponse);
        }

        const token = header.split(' ')[1];

        try {
            const user = await tokenManager.verifyToken(token, 'access');
            if (!user) {
                throw new NotAuthenticatedException();
            }
            req.user = user;
            log.debug('User authenticated', { userId: user.userId, role: user.role });
            next();
        } catch (error: unknown) {
            log.warn('Authentication failed', {
                error: log.formatError(error),
            });
            const errorResponse = createErrorResponse(error, 401);
            return res.status(errorResponse.status).json(errorResponse);
        }
    };
};

export const optionalAuthMiddleware = (tokenManager: ITokenManager) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer ')) {
            return next();
        }

        const token = header.split(' ')[1];

        try {
            const user = await tokenManager.verifyToken(token, 'access');
            if (user) {
                req.user = user;
                log.debug('User optionally authenticated', { userId: user.userId, role: user.role });
            }
        } catch (error: unknown) {
            log.debug('Optional authentication failed, continuing without user', {
                error: log.formatError(error),
            });
        }

        next();
    };
};
