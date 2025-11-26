import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, ApplicationException, IFileStorageManager } from '@application/common';
import { Roles } from '@common/constants/roles';
import { IUserRepository } from '@domain/models/user';

import { UserNotFoundException } from '../exceptions';

export class UploadUserAvatar {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly fileId: string,
    ) {}
}

export class UploadUserAvatarHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly fileStorageManager: IFileStorageManager,
    ) {}

    execute(command: UploadUserAvatar): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            let permanentPath: string | null = null;

            try {
                const user = await this.userRepo.findById(command.userId);
                if (!user) throw new UserNotFoundException();

                if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                    throw new AccessDeniedException();
                }

                permanentPath = await this.fileStorageManager.moveToPermanentStorage(command.fileId, 'avatars');
                if (user.avatarUrl) {
                    await this.fileStorageManager.deleteFromPermanentStorage(user.avatarUrl);
                }
                user.changeAvatar(permanentPath);

                await this.userRepo.save(user);

                return user.id;
            } catch (error) {
                if (permanentPath) {
                    this.fileStorageManager.deleteFromPermanentStorage(permanentPath);
                } else {
                    this.fileStorageManager.deleteFromTempStorage(command.fileId);
                }

                throw error;
            }
        });
    }
}
