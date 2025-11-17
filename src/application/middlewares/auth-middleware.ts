import { verifyToken } from '@application/services/auth/utils/token-service';
import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { InactiveTokenException, InvalidTokenPayloadException } from '../../domain/auth';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = header.split(' ')[1];

    try {
        const user = await verifyToken(token, 'access');
        req.user = user;

        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: error.message });
        }

        if (error instanceof InactiveTokenException) {
            return res.status(401).json({ message: error.message });
        }

        if (error instanceof JsonWebTokenError || error instanceof InvalidTokenPayloadException) {
            return res.status(401).json({ message: error.message });
        }

        console.error('[AuthMiddleware]', error);
        return res.status(500).json({ message: 'Authorization server error' });
    }
};
