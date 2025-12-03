import { Request, Response } from 'express';

import { IS_PROD_MODE } from '@common/config/app';
import { refreshTokenTtlSeconds } from '@common/config/token';

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: IS_PROD_MODE,
        sameSite: 'strict',
        maxAge: refreshTokenTtlSeconds * 1000,
        path: '/',
    });
}

export function clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: IS_PROD_MODE,
        sameSite: 'strict',
        path: '/',
    });
}

export function getRefreshTokenFromCookie(req: Request): string | undefined {
    return req.cookies?.refreshToken;
}
