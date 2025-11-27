import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { AccessDeniedException, ApplicationException, IFileStorageManager, safeAsync } from '@application/common';
import { Roles } from '@common/constants/roles';
import { IUserRepository } from '@domain/models/user';

import { UserNotFoundException } from '../exceptions';

export class DeleteUserAvatar {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
    ) {}
}

export class DeleteUserAvatarHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly fileStorageManager: IFileStorageManager,
    ) {}

    execute(command: DeleteUserAvatar): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();

            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            const avatarUrl = user.imageName;
            if (!avatarUrl) {
                return user.id;
            }
            await this.fileStorageManager.deleteFromPermanentStorage(avatarUrl);

            user.changeAvatar(undefined);
            await this.userRepo.save(user);

            return user.id;
        });
    }
}
