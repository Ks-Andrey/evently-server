import { NotFoundError } from '@domain/common';
import { User, IUserRepository } from '@domain/user';

import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common/utils/safe-async';

export class FindUserByEmail {
    constructor(readonly email: UUID) {}
}

export class FindUserByIdHandler {
    constructor(readonly userRepo: IUserRepository) {}

    async execute(command: FindUserByEmail): Promise<Result<User, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findByUsername(command.email);
            if (!user) throw new NotFoundError();
            return user;
        });
    }
}
