import { UUID } from 'crypto';
import { Result } from 'true-myth';

import {
    AccessDeniedException,
    ApplicationException,
    IFileStorageManager,
    executeInTransaction,
} from '@application/common';
import { Roles } from '@common/constants/roles';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { log } from '@common/utils/logger';
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
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: DeleteUserAvatar): Promise<Result<UUID, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();

            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            const avatarUrl = user.imageUrl;
            if (!avatarUrl) {
                return user.id;
            }

            const oldAvatarUrl = avatarUrl;

            try {
                user.changeAvatar(undefined);
                await this.userRepo.save(user);

                await this.fileStorageManager.delete(oldAvatarUrl);
            } catch (error) {
                log.error('Error deleting avatar, starting rollback', {
                    userId: command.userId,
                    avatarUrl: oldAvatarUrl,
                    error: log.formatError(error),
                });

                try {
                    user.changeAvatar(oldAvatarUrl);
                } catch (rollbackErr) {
                    log.error('Failed to rollback avatar deletion in model', {
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
