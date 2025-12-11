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
import { IEventRepository } from '@domain/events/event';

import { AddGalleryPhotosResult } from '../dto/add-gallery-photos-result';
import { EventNotFoundException } from '../exceptions';

export class AddEventGalleryPhotos {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly eventId: UUID,
        readonly files: MemoryUploadedFile[],
    ) {}
}

export class AddEventGalleryPhotosHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly fileStorageManager: IFileStorageManager,
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: AddEventGalleryPhotos): Promise<Result<AddGalleryPhotosResult, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventNotFoundException();

            if (command.role !== Roles.ADMIN && !event.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            event.addPhotos(command.files.map((file) => file.originalname));
            await this.eventRepo.save(event);

            for (const file of command.files) {
                await this.fileStorageManager.save(file.buffer, file.originalname, UPLOAD_DIRECTORIES.EVENTS);
            }

            return AddGalleryPhotosResult.create(event.id, command.files.length);
        });
    }
}
