import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { IUserRepository } from '@domain/identity/user';

import { ToggleBlockUserResult } from '../dto/toggle-block-user-result';
import { UserNotFoundException } from '../exceptions';

export class ToggleBlockUser {
    constructor(readonly userId: UUID) {}
}

export class ToggleBlockUserHandler {
    constructor(readonly userRepo: IUserRepository) {}

    execute(command: ToggleBlockUser): Promise<Result<ToggleBlockUserResult, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();

            if (user.isBlocked) {
                user.unblock();
            } else {
                user.block();
            }

            await this.userRepo.save(user);

            return ToggleBlockUserResult.create(user.id, user.isBlocked);
        });
    }
}
