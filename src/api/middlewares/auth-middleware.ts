import { Request, Response, NextFunction } from 'express';

import { ApplicationException } from '@application/common';
import { ITokenManager } from '@application/services/auth';

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
            if (error instanceof ApplicationException) {
                return res.status(401).json({ message: error.message });
            }

            return res.status(500);
        }
    };
};
