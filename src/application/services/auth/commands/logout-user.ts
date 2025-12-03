import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';

import { LogoutResult } from '../dto/logout-result';
import { ITokenManager } from '../interfaces/token-manager';

export class LogoutUser {
    constructor(
        readonly userId: UUID,
        readonly accessToken: string,
        readonly refreshToken?: string,
    ) {}
}

export class LogoutUserHandler {
    constructor(private readonly tokenManager: ITokenManager) {}

    execute(command: LogoutUser): Promise<Result<LogoutResult, ApplicationException>> {
        return safeAsync(async () => {
            await this.tokenManager.revokeToken(command.accessToken, 'access');

            if (command.refreshToken !== undefined) {
                await this.tokenManager.revokeToken(command.refreshToken, 'refresh', command.userId);
            }

            return LogoutResult.create();
        });
    }
}
