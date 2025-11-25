import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { Roles } from '@common/config/roles';
import { UserJwtPayload } from '@common/types/auth';
import { IUserRepository } from '@domain/models/user';

import { InvalidCredentialsException } from '../exceptions';
import { ITokenManager } from '../interfaces/token-manager';

export class AuthenticateUser {
    constructor(
        readonly email: string,
        readonly password: string,
    ) {}
}

export class AuthenticateUserHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly tokenManager: ITokenManager,
    ) {}

    execute(command: AuthenticateUser): Promise<Result<{ accessToken: string; refreshToken: string }, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findByEmail(command.email.trim().toLowerCase());
            if (!user) throw new InvalidCredentialsException();

            await user.ensureValidPassword(command.password);

            const payload: UserJwtPayload = {
                userId: user.id,
                role: user.userType.typeName as Roles,
            };

            return this.tokenManager.issueTokens(payload);
        });
    }
}
