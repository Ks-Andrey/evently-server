import { Request, Response, NextFunction } from 'express';

import { ApplicationException, ApplicationErrorCodes } from '@application/common';
import { ITokenManager } from '@application/services/auth';
import { errorMessages } from '@common/config/errors';

import { createErrorResponse } from '../utils/error-handler';

export const authMiddleware = (tokenManager: ITokenManager) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer ')) {
            const errorResponse = createErrorResponse(
                new ApplicationException(errorMessages.domain.common.accessDenied, ApplicationErrorCodes.ACCESS_DENIED),
                401,
            );
            return res.status(401).json(errorResponse);
        }

        const token = header.split(' ')[1];

        try {
            const user = await tokenManager.verifyToken(token, 'access');
            req.user = user;
            next();
        } catch (error) {
            if (error instanceof ApplicationException) {
                const errorResponse = createErrorResponse(error, 401);
                return res.status(401).json(errorResponse);
            }
            const errorResponse = createErrorResponse(
                new ApplicationException(errorMessages.domain.common.unknownError, ApplicationErrorCodes.UNKNOWN_ERROR),
                500,
            );
            return res.status(500).json(errorResponse);
        }
    };
};
