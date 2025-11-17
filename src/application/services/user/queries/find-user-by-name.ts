import { NotFoundException } from '@domain/common';
import { User, IUserRepository } from '@domain/user';

import { Result } from 'true-myth';

import { safeAsync } from '../../common';

export class FindUserByName {
    constructor(readonly username: string) {}
}

export class FindUserByIdHandler {
    constructor(readonly userRepo: IUserRepository) {}

    async execute(query: FindUserByName): Promise<Result<User, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findByUsername(query.username);
            if (!user) throw new NotFoundException();
            return user;
        });
    }
}
