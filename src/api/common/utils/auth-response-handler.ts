import { Response } from 'express';
import { Result } from 'true-myth';

import { ApplicationException } from '@application/common';
import { Tokens } from '@common/types/auth';

import { setRefreshTokenCookie, clearRefreshTokenCookie } from './cookie-helper';
import { handleResult } from './error-handler';

export function handleAuthResult(result: Result<Tokens, ApplicationException>, res: Response): void {
    if (result.isErr) {
        handleResult(result, res);
        return;
    }

    const tokens = result.value;
    setRefreshTokenCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken });
}

export function handleLogoutResult(result: Result<boolean, ApplicationException>, res: Response): void {
    if (result.isErr) {
        handleResult(result, res);
        return;
    }

    clearRefreshTokenCookie(res);
    res.json(result.value);
}
