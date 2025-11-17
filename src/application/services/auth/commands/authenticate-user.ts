import { Roles } from '@common/config/roles';
import { UserJwtPayload } from '@common/types/jwtUserPayload';
import { InvalidCredentialsException } from '@domain/auth';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { safeAsync } from '../../common';
import { issueTokens } from '../utils/token-service';

export class AuthenticateUser {
    constructor(
        readonly email: string,
        readonly password: string,
    ) {}
}

export class AuthenticateUserHandler {
    constructor(private readonly userRepo: IUserRepository) {}

    execute(command: AuthenticateUser): Promise<Result<{ accessToken: string; refreshToken: string }, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findByEmail(command.email.trim().toLowerCase());
            if (!user) throw new InvalidCredentialsException();

            await user.validPassword(command.password);

            const payload: UserJwtPayload = {
                userId: user.id,
                role: user.userType.typeName as Roles,
            };

            return issueTokens(payload);
        });
    }
}
