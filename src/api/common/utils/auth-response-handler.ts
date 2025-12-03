import { Response } from 'express';
import { Result } from 'true-myth';

import { ApplicationException } from '@application/common';
import { AuthenticateUserResult, LogoutResult, RefreshTokensResult } from '@application/services/auth';

import { setRefreshTokenCookie, clearRefreshTokenCookie } from './cookie-helper';
import { handleResult } from './error-handler';

export function handleAuthResult(
    result: Result<AuthenticateUserResult | RefreshTokensResult, ApplicationException>,
    res: Response,
): void {
    if (result.isErr) {
        handleResult(result, res);
        return;
    }

    const tokens = result.value;
    setRefreshTokenCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken });
}

export function handleLogoutResult(result: Result<LogoutResult, ApplicationException>, res: Response): void {
    if (result.isErr) {
        handleResult(result, res);
        return;
    }

    clearRefreshTokenCookie(res);
    res.json(result.value);
}
