import { NotFoundError } from '@domain/common';
import { User, IUserRepository } from '@domain/user';

import { Result } from 'true-myth';

import { safeAsync } from '../../common/utils/safe-async';

export class FindUserByEmail {
    constructor(readonly email: string) {}
}

export class FindUserByIdHandler {
    constructor(readonly userRepo: IUserRepository) {}

    async execute(query: FindUserByEmail): Promise<Result<User, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findByUsername(query.email);
            if (!user) throw new NotFoundError();
            return user;
        });
    }
}
