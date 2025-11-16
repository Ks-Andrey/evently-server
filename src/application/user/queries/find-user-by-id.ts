import { NotFoundError } from '@domain/common';
import { User, IUserRepository } from '@domain/user';

import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class FindUserById {
    constructor(readonly userId: UUID) {}
}

export class FindUserByIdHandler {
    constructor(readonly userRepo: IUserRepository) {}

    async execute(query: FindUserById): Promise<Result<User, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(query.userId);
            if (!user) throw new NotFoundError();
            return user;
        });
    }
}
