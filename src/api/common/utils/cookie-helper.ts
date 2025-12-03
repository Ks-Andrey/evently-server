import { Request, Response } from 'express';

import { refreshTokenTtlSeconds } from '@common/config/token';

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: refreshTokenTtlSeconds * 1000,
        path: '/',
    });
}

export function clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
}

export function getRefreshTokenFromCookie(req: Request): string | undefined {
    return req.cookies?.refreshToken;
}
