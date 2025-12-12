import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class DeleteGalleryPhotoResult {
    private constructor(
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(eventId: UUID): DeleteGalleryPhotoResult {
        return new DeleteGalleryPhotoResult(eventId, MESSAGES.result.event.galleryPhotoDeleted);
    }
}
