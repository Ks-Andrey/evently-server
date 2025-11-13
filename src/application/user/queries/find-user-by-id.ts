import { NotFoundError } from '@domain/common';
import { User, IUserRepository } from '@domain/user';

import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class FindUserById {
    constructor(readonly id: UUID) {}
}

export class FindUserByIdHandler {
    constructor(readonly userRepo: IUserRepository) {}

    async execute(command: FindUserById): Promise<Result<User, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.id);
            if (!user) throw new NotFoundError();
            return user;
        });
    }
}
