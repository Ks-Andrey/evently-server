import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { AccessDeniedException, ApplicationException, IFileStorageManager, safeAsync } from '@application/common';
import { Roles } from '@common/constants/roles';
import { IUserRepository } from '@domain/models/user';

import { UserNotFoundException } from '../exceptions';

export class UploadUserAvatar {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly fileName: string,
    ) {}
}

export class UploadUserAvatarHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly fileStorageManager: IFileStorageManager,
    ) {}

    execute(command: UploadUserAvatar): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();

            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            const oldImageName = user.imageName;
            try {
                await this.fileStorageManager.moveToPermanentStorage(command.fileName, 'avatars');
            } catch (error) {
                await this.fileStorageManager.deleteFromTempStorage(command.fileName);
                throw error;
            }

            user.changeAvatar(command.fileName);
            await this.userRepo.save(user);

            if (oldImageName) {
                await this.fileStorageManager.deleteFromPermanentStorage(oldImageName);
            }

            return user.id;
        });
    }
}
