import { UUID } from 'crypto';
import { Result } from 'true-myth';

import {
    AccessDeniedException,
    ApplicationException,
    IFileStorageManager,
    executeInTransaction,
} from '@application/common';
import { STORAGE_PATHS } from '@common/constants/file-upload';
import { Roles } from '@common/constants/roles';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { log } from '@common/utils/logger';
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
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: UploadUserAvatar): Promise<Result<UUID, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();

            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            const oldImagePath = user.imageUrl;
            const newTempPath = `${STORAGE_PATHS.TEMP_DIR_NAME}/${command.fileName}`;
            const newPermanentPath = `${STORAGE_PATHS.PERMANENT_DIR_NAME}/${command.fileName}`;

            let fileMoved = false;

            try {
                await this.fileStorageManager.moveTo(newTempPath, STORAGE_PATHS.PERMANENT_DIR_NAME);
                fileMoved = true;

                user.changeAvatar(newPermanentPath);
                await this.userRepo.save(user);

                await this.fileStorageManager.delete(newTempPath);
            } catch (error) {
                log.error('Error uploading avatar, starting rollback', {
                    userId: command.userId,
                    fileName: command.fileName,
                    error: log.formatError(error),
                });

                if (fileMoved) {
                    try {
                        await this.fileStorageManager.delete(newPermanentPath);
                    } catch (rollbackErr) {
                        log.error('Failed to delete permanent file during rollback', {
                            filePath: newPermanentPath,
                            error: log.formatError(rollbackErr),
                        });
                    }

                    try {
                        await this.fileStorageManager.delete(newTempPath);
                    } catch (rollbackErr) {
                        log.error('Failed to delete temp file during rollback', {
                            filePath: newTempPath,
                            error: log.formatError(rollbackErr),
                        });
                    }
                } else {
                    try {
                        await this.fileStorageManager.delete(newTempPath);
                    } catch (rollbackErr) {
                        log.error('Failed to delete temp file during rollback', {
                            filePath: newTempPath,
                            error: log.formatError(rollbackErr),
                        });
                    }
                }

                try {
                    user.changeAvatar(oldImagePath);
                } catch (rollbackErr) {
                    log.error('Failed to rollback avatar change in model', {
                        userId: command.userId,
                        error: log.formatError(rollbackErr),
                    });
                }

                throw error;
            }

            return user.id;
        });
    }
}
