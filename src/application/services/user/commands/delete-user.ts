import { NotFoundException } from '@domain/common';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class DeleteUser {
    constructor(readonly userId: UUID) {}
}

export class DeleteUserHandler {
    constructor(readonly userRepo: IUserRepository) {}

    execute(command: DeleteUser): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();

            await this.userRepo.delete(user.id);

            return user.id;
        });
    }
}
