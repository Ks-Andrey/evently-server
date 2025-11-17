import { NotFoundException } from '@domain/common';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class EditUserPassword {
    constructor(
        readonly userId: UUID,
        readonly oldPassword: string,
        readonly newPassword: string,
    ) {}
}

export class EditUserPasswordHandler {
    constructor(readonly userRepo: IUserRepository) {}

    execute(command: EditUserPassword): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();

            user.validPassword(command.oldPassword);
            user.changePassword(command.newPassword);

            await this.userRepo.save(user);

            return user.id;
        });
    }
}
