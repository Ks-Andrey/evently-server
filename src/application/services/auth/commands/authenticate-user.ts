import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { UserJwtPayload } from '@common/types/auth';
import { IUserRepository } from '@domain/identity/user';

import { AuthenticateUserResult } from '../dto/authenticate-user-result';
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

    execute(command: AuthenticateUser): Promise<Result<AuthenticateUserResult, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findByEmail(command.email.trim());
            if (!user) throw new InvalidCredentialsException();

            await user.ensureValidPassword(command.password);

            const payload: UserJwtPayload = {
                userId: user.id,
                role: user.userType.role,
            };

            const tokens = await this.tokenManager.issueTokens(payload);
            return AuthenticateUserResult.create(tokens);
        });
    }
}
