import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { IFileStorageManager, AccessDeniedException, ApplicationException, safeAsync } from '@application/common';
import { Roles } from '@common/constants/roles';
import { IEventRepository } from '@domain/models/event';

import { EventNotFoundException } from '../exceptions';

export class AddEventGalleryPhotos {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly eventId: UUID,
        readonly fileNames: string[],
    ) {}
}

export class AddEventGalleryPhotosHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly fileStorageManager: IFileStorageManager,
    ) {}

    execute(command: AddEventGalleryPhotos): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventNotFoundException();

            if (command.role !== Roles.ADMIN && !event.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            const movedFiles: string[] = [];
            try {
                for (const fileName of command.fileNames) {
                    await this.fileStorageManager.moveToPermanentStorage(fileName, 'events');
                }
            } catch (error) {
                for (const fileName of movedFiles) {
                    await this.fileStorageManager.deleteFromPermanentStorage(fileName);
                }
                for (const fileName of command.fileNames) {
                    await this.fileStorageManager.deleteFromTempStorage(fileName);
                }
                throw error;
            }

            event.addPhotos(command.fileNames);
            await this.eventRepo.save(event);

            return event.id;
        });
    }
}
