import { UUID } from 'crypto';
import { Result } from 'true-myth';

import {
    IFileStorageManager,
    AccessDeniedException,
    ApplicationException,
    executeInTransaction,
} from '@application/common';
import { Roles } from '@common/constants/roles';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { log } from '@common/utils/logger';
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
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: AddEventGalleryPhotos): Promise<Result<UUID, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventNotFoundException();

            if (command.role !== Roles.ADMIN && !event.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            const oldImageUrls = [...event.imageUrls];
            const movedFiles: string[] = [];
            let modelUpdated = false;

            try {
                for (const fileName of command.fileNames) {
                    await this.fileStorageManager.moveTo(fileName, 'events');
                    movedFiles.push(fileName);
                }

                event.addPhotos(command.fileNames);
                await this.eventRepo.save(event);
                modelUpdated = true;

                for (const fileName of command.fileNames) {
                    await this.fileStorageManager.delete(fileName);
                }
            } catch (error) {
                log.error('Error adding gallery photos, starting rollback', {
                    eventId: command.eventId,
                    userId: command.userId,
                    fileNames: command.fileNames,
                    movedFiles,
                    error: log.formatError(error),
                });

                for (const fileName of movedFiles) {
                    try {
                        await this.fileStorageManager.delete(fileName);
                    } catch (rollbackErr) {
                        log.error('Failed to delete moved file during rollback', {
                            fileName,
                            error: log.formatError(rollbackErr),
                        });
                    }
                }

                for (const fileName of command.fileNames) {
                    try {
                        await this.fileStorageManager.delete(fileName);
                    } catch (rollbackErr) {
                        log.error('Failed to delete temp file during rollback', {
                            fileName,
                            error: log.formatError(rollbackErr),
                        });
                    }
                }

                if (modelUpdated) {
                    try {
                        const currentUrls = event.imageUrls;
                        for (const url of currentUrls) {
                            if (!oldImageUrls.includes(url)) {
                                event.removePhoto(url);
                            }
                        }
                    } catch (rollbackErr) {
                        log.error('Failed to rollback gallery photos in model', {
                            eventId: command.eventId,
                            error: log.formatError(rollbackErr),
                        });
                    }
                }

                throw error;
            }

            return event.id;
        });
    }
}
