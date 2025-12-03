import { Result } from 'true-myth';

import { ApplicationException, NotAuthenticatedException, safeAsync } from '@application/common';
import { Tokens, UserJwtPayload } from '@common/types/auth';

import { ITokenManager } from '../interfaces/token-manager';

export class RefreshTokens {
    constructor(readonly refreshToken: string) {}
}

export class RefreshTokensHandler {
    constructor(private readonly tokenManager: ITokenManager) {}

    execute(command: RefreshTokens): Promise<Result<Tokens, ApplicationException>> {
        return safeAsync(async () => {
            const payload = await this.tokenManager.verifyToken(command.refreshToken, 'refresh');
            if (!payload) throw new NotAuthenticatedException();

            await this.tokenManager.revokeToken(command.refreshToken, 'refresh', payload.userId);

            const userPayload: UserJwtPayload = {
                userId: payload.userId,
                role: payload.role,
            };

            return await this.tokenManager.issueTokens(userPayload);
        });
    }
}
