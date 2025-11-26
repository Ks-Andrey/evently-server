import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { safeAsync, IFileStorage, ApplicationException, AccessDeniedException } from '@application/common';
import { IEventRepository } from '@domain/models/event';

import { EventNotFoundException } from '../exceptions';

export class DeleteGalleryPhoto {
    constructor(
        public readonly eventId: UUID,
        public readonly organizerId: UUID,
        public readonly photoUrl: string,
    ) {}
}

export class DeleteGalleryPhotoHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly fileStorage: IFileStorage,
    ) {}

    async execute(command: DeleteGalleryPhoto): Promise<Result<void, ApplicationException>> {
        return safeAsync(async () => {
            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventNotFoundException({ eventId: command.eventId });

            if (!event.canEditedBy(command.organizerId)) {
                throw new AccessDeniedException({ eventId: command.eventId, organizerId: command.organizerId });
            }

            event.removeGalleryPhoto(command.photoUrl);

            await this.fileStorage.deleteFile(command.photoUrl);
            await this.eventRepo.save(event);
        });
    }
}
