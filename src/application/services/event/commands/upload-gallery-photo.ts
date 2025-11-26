import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { safeAsync, IFileStorage, ApplicationException, AccessDeniedException } from '@application/common';
import { GALLERY_MAX_PHOTOS } from '@common/constants/file-upload';
import { IEventRepository, GalleryPhotoFile } from '@domain/models/event';

import { EventNotFoundException } from '../exceptions';

export class UploadGalleryPhoto {
    constructor(
        public readonly eventId: UUID,
        public readonly organizerId: UUID,
        public readonly file: GalleryPhotoFile,
    ) {}
}

export class UploadGalleryPhotoHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly fileStorage: IFileStorage,
    ) {}

    async execute(command: UploadGalleryPhoto): Promise<Result<string, ApplicationException>> {
        return safeAsync(async () => {
            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventNotFoundException({ eventId: command.eventId });

            if (!event.canEditedBy(command.organizerId)) {
                throw new AccessDeniedException({ eventId: command.eventId, organizerId: command.organizerId });
            }

            // Загружаем фото
            const uploadResult = await this.fileStorage.uploadGalleryPhoto(
                command.eventId,
                command.file.buffer,
                command.file.mimeType,
                command.file.fileName,
            );

            event.addGalleryPhoto(uploadResult.url, GALLERY_MAX_PHOTOS);
            await this.eventRepo.save(event);

            return uploadResult.url;
        });
    }
}
