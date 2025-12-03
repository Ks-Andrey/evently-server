import { Result } from 'true-myth';

import { ApplicationException, NotAuthenticatedException, safeAsync } from '@application/common';
import { UserJwtPayload } from '@common/types/auth';

import { RefreshTokensResult } from '../dto/refresh-tokens-result';
import { ITokenManager } from '../interfaces/token-manager';

export class RefreshTokens {
    constructor(readonly refreshToken: string) {}
}

export class RefreshTokensHandler {
    constructor(private readonly tokenManager: ITokenManager) {}

    execute(command: RefreshTokens): Promise<Result<RefreshTokensResult, ApplicationException>> {
        return safeAsync(async () => {
            const payload = await this.tokenManager.verifyToken(command.refreshToken, 'refresh');
            if (!payload) throw new NotAuthenticatedException();

            await this.tokenManager.revokeToken(command.refreshToken, 'refresh', payload.userId);

            const userPayload: UserJwtPayload = {
                userId: payload.userId,
                role: payload.role,
            };

            const tokens = await this.tokenManager.issueTokens(userPayload);
            return RefreshTokensResult.create(tokens);
        });
    }
}
