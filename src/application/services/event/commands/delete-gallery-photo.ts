import { UUID } from 'crypto';
import { Result } from 'true-myth';

import {
    IFileStorageManager,
    AccessDeniedException,
    ApplicationException,
    executeInTransaction,
} from '@application/common';
import { UPLOAD_DIRECTORIES } from '@common/constants/file-upload';
import { Roles } from '@common/constants/roles';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { log } from '@common/utils/logger';
import { IEventRepository } from '@domain/events/event';

import { DeleteGalleryPhotoResult } from '../dto/delete-gallery-photo-result';
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
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: DeleteEventGalleryPhoto): Promise<Result<DeleteGalleryPhotoResult, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventNotFoundException();

            if (command.role !== Roles.ADMIN && !event.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            const photoUrl = command.photoUrl;
            let modelUpdated = false;

            try {
                event.removePhoto(photoUrl);
                await this.eventRepo.save(event);
                modelUpdated = true;

                await this.fileStorageManager.delete(photoUrl, UPLOAD_DIRECTORIES.EVENTS);
            } catch (error) {
                log.error('Error deleting gallery photo, starting rollback', {
                    eventId: command.eventId,
                    userId: command.userId,
                    photoUrl,
                    error: log.formatError(error),
                });

                if (modelUpdated) {
                    try {
                        event.addPhoto(photoUrl);
                    } catch (rollbackErr) {
                        log.error('Failed to rollback photo deletion in model', {
                            eventId: command.eventId,
                            photoUrl,
                            error: log.formatError(rollbackErr),
                        });
                    }
                }

                throw error;
            }

            return DeleteGalleryPhotoResult.create(event.id);
        });
    }
}
