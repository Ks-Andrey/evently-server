import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { safeAsync, IFileStorage, ApplicationException } from '@application/common';
import { IUserRepository } from '@domain/models/user';
import { AvatarFile } from '@domain/models/user/entities/avatar-file';

import { UserNotFoundException } from '../exceptions';

export class UploadAvatar {
    constructor(
        public readonly userId: UUID,
        public readonly file: AvatarFile,
    ) {}
}

export class UploadAvatarHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly fileStorage: IFileStorage,
    ) {}

    async execute(command: UploadAvatar): Promise<Result<string, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException({ userId: command.userId });

            if (user.avatarUrl) {
                await this.fileStorage.deleteFile(user.avatarUrl);
            }

            const uploadResult = await this.fileStorage.uploadAvatar(
                command.userId,
                command.file.buffer,
                command.file.mimeType,
                command.file.fileName,
            );

            user.changeAvatar(uploadResult.url);
            await this.userRepo.save(user);

            return uploadResult.url;
        });
    }
}
