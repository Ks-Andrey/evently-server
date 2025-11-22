import { Request, Response, NextFunction } from 'express';

import { ITokenManager } from '@application/services/auth';
import { DomainException } from '@domain/common';

export const authMiddleware = (tokenManager: ITokenManager) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = header.split(' ')[1];

        try {
            const user = await tokenManager.verifyToken(token, 'access');
            req.user = user;
            next();
        } catch (error) {
            if (error instanceof DomainException) {
                return res.status(401).json({ message: error.message });
            }

            console.error('[AuthMiddleware]', error);
            return res.status(500).json({ message: 'Authorization server error' });
        }
    };
};
