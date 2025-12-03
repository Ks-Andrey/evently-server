import { UUID } from 'crypto';
import { Request } from 'express';

import { AuthenticateUser, ConfirmUserEmail, RefreshTokens, LogoutUser } from '@application/services/auth';
import { CreateUser } from '@application/services/user';

import { getRefreshTokenFromCookie } from '../common/utils/cookie-helper';

export class AuthMapper {
    static toRegisterCommand(req: Request): CreateUser {
        const { userTypeId, username, email, password } = req.body;
        return new CreateUser(userTypeId, username, email, password);
    }

    static toLoginCommand(req: Request): AuthenticateUser {
        const { email, password } = req.body;
        return new AuthenticateUser(email, password);
    }

    static toConfirmEmailCommand(req: Request): ConfirmUserEmail {
        const { token } = req.query;
        return new ConfirmUserEmail(token as UUID);
    }

    static toRefreshTokensCommand(req: Request): RefreshTokens {
        const refreshToken = getRefreshTokenFromCookie(req);
        if (!refreshToken) {
            throw new Error('Refresh token not found in cookies');
        }
        return new RefreshTokens(refreshToken);
    }

    static toLogoutCommand(req: Request): LogoutUser {
        const refreshToken = getRefreshTokenFromCookie(req);
        const userId = req.user!.userId;
        const accessToken = req.headers.authorization!.split(' ')[1];
        return new LogoutUser(userId, accessToken, refreshToken);
    }
}
