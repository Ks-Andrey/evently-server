import { NotFoundError } from '@domain/common';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class EditUser {
    constructor(
        readonly userId: UUID,
        readonly username?: string,
        readonly personalData?: string,
    ) {}
}

export class EditUserHandler {
    constructor(readonly userRepo: IUserRepository) {}

    execute(command: EditUser): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundError();

            command.personalData && user.changeUserData(command.personalData);
            command.username && user.changeUsername(command.username);

            await this.userRepo.save(user);

            return user.id;
        });
    }
}
