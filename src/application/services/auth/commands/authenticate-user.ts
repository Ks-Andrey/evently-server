import { InvalidCredentialsException } from '@domain/auth';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { safeAsync } from '../../common';

export class AuthenticateUser {
    constructor(
        readonly email: string,
        readonly password: string,
    ) {}
}

export class AuthenticateUserHandler {
    constructor(private readonly userRepo: IUserRepository) {}

    execute(command: AuthenticateUser): Promise<Result<string, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findByEmail(command.email.trim().toLowerCase());
            if (!user) throw new InvalidCredentialsException();

            await user.validPassword(command.password);

            return user.id;
        });
    }
}
