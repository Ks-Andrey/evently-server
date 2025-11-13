import { NotFoundError } from '@domain/common';
import { User, IUserRepository } from '@domain/user';

import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class FindUserByName {
    constructor(readonly username: UUID) {}
}

export class FindUserByIdHandler {
    constructor(readonly userRepo: IUserRepository) {}

    async execute(command: FindUserByName): Promise<Result<User, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findByUsername(command.username);
            if (!user) throw new NotFoundError();
            return user;
        });
    }
}
