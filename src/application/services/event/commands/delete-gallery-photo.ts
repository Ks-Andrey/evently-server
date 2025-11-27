import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, IFileStorageManager, AccessDeniedException, ApplicationException } from '@application/common';
import { Roles } from '@common/constants/roles';
import { IEventRepository } from '@domain/models/event';

import { EventNotFoundException } from '../exceptions';

export class DeleteEventGalleryPhoto {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly eventId: UUID,
        readonly photoUrl: string,
    ) {}
}

export class DeleteEventGalleryPhotoHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly fileStorageManager: IFileStorageManager,
    ) {}

    execute(command: DeleteEventGalleryPhoto): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventNotFoundException();

            if (command.role !== Roles.ADMIN && !event.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            event.removePhoto(command.photoUrl);
            await this.eventRepo.save(event);

            try {
                await this.fileStorageManager.deleteFromPermanentStorage(command.photoUrl);
                return event.id;
            } catch (error) {
                event.addPhoto(command.photoUrl);
                await this.eventRepo.save(event);

                throw error;
            }
        });
    }
}
