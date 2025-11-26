import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { safeAsync, IFileStorage, ApplicationException } from '@application/common';
import { IUserRepository } from '@domain/models/user';

import { UserNotFoundException } from '../exceptions';

export class DeleteAvatar {
    constructor(public readonly userId: UUID) {}
}

export class DeleteAvatarHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly fileStorage: IFileStorage,
    ) {}

    async execute(command: DeleteAvatar): Promise<Result<void, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException({ userId: command.userId });

            if (user.avatarUrl) {
                await this.fileStorage.deleteFile(user.avatarUrl);
                user.changeAvatar(undefined);
                await this.userRepo.save(user);
            }
        });
    }
}
