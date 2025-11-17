import { secret } from '@common/config/secret';
import { UserJwtPayload } from '@common/types/jwtUserPayload';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token, secret) as jwt.JwtPayload;

        const user: UserJwtPayload = {
            userId: payload.userId,
            roles: payload.roles,
        };

        req.user = user;

        next();
    } catch (_) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
