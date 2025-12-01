import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { Tokens, UserJwtPayload } from '@common/types/auth';
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

    execute(command: AuthenticateUser): Promise<Result<Tokens, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findByEmail(command.email.trim().toLowerCase());
            if (!user) throw new InvalidCredentialsException();

            await user.ensureValidPassword(command.password);

            const payload: UserJwtPayload = {
                userId: user.id,
                role: user.userType.role,
            };

            return this.tokenManager.issueTokens(payload);
        });
    }
}
