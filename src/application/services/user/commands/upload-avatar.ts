import { UUID } from 'crypto';
import { Result } from 'true-myth';

import {
    AccessDeniedException,
    ApplicationException,
    IFileStorageManager,
    executeInTransaction,
} from '@application/common';
import { UPLOAD_DIRECTORIES } from '@common/constants/file-upload';
import { Roles } from '@common/constants/roles';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { IUserRepository } from '@domain/identity/user';

import { UploadAvatarResult } from '../dto/upload-avatar-result';
import { UserNotFoundException } from '../exceptions';

export class UploadUserAvatar {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly file: MemoryUploadedFile,
    ) {}
}

export class UploadUserAvatarHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly fileStorageManager: IFileStorageManager,
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: UploadUserAvatar): Promise<Result<UploadAvatarResult, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();

            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            user.changeAvatar(command.file.originalname);
            await this.userRepo.save(user);

            await this.fileStorageManager.save(
                command.file.buffer,
                command.file.originalname,
                UPLOAD_DIRECTORIES.AVATARS,
            );

            return UploadAvatarResult.create(user.id);
        });
    }
}
