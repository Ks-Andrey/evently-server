import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { NotFoundException } from '@application/common/exceptions/exceptions';
import { IUserRepository } from '@domain/models/user';

export class ToggleBlockUser {
    constructor(readonly userId: UUID) {}
}

export class ToggleBlockUserHandler {
    constructor(readonly userRepo: IUserRepository) {}

    execute(command: ToggleBlockUser): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();

            if (user.isBlocked) {
                user.block();
            } else {
                user.unblock();
            }

            await this.userRepo.save(user);

            return user.id;
        });
    }
}
