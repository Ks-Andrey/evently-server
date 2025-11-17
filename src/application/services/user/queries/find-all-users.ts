import { User, IUserRepository } from '@domain/user';

import { Result } from 'true-myth';

import { safeAsync } from '../../common';

export class FindAllUsersHandler {
    constructor(readonly userRepo: IUserRepository) {}

    async execute(): Promise<Result<User[], Error>> {
        return safeAsync(async () => {
            return await this.userRepo.findAll();
        });
    }
}
