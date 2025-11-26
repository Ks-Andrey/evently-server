import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, IFileStorageManager, AccessDeniedException, ApplicationException } from '@application/common';
import { GALLERY_MAX_PHOTOS } from '@common/constants/file-upload';
import { Roles } from '@common/constants/roles';
import { IEventRepository } from '@domain/models/event';

import { EventNotFoundException } from '../exceptions';

export class AddEventGalleryPhoto {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly eventId: UUID,
        readonly fileId: string,
    ) {}
}

export class AddEventGalleryPhotoHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly fileStorageManager: IFileStorageManager,
    ) {}

    execute(command: AddEventGalleryPhoto): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            let permanentPath: string | null = null;

            try {
                const event = await this.eventRepo.findById(command.eventId);
                if (!event) throw new EventNotFoundException();

                if (command.role !== Roles.ADMIN && !event.canEditedBy(command.userId)) {
                    throw new AccessDeniedException();
                }

                permanentPath = await this.fileStorageManager.moveToPermanentStorage(command.fileId, 'events');
                event.addGalleryPhoto(permanentPath, GALLERY_MAX_PHOTOS);

                await this.eventRepo.save(event);

                return event.id;
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
