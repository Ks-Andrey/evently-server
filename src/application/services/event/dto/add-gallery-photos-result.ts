import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class AddGalleryPhotosResult {
    private constructor(
        readonly eventId: UUID,
        readonly photosAdded: number,
        readonly message: string,
    ) {}

    static create(eventId: UUID, photosCount: number): AddGalleryPhotosResult {
        return new AddGalleryPhotosResult(eventId, photosCount, MESSAGES.result.event.galleryPhotosAdded(photosCount));
    }
}
