import { UUID } from 'crypto';

export class AddGalleryPhotosResult {
    private constructor(
        readonly eventId: UUID,
        readonly photosAdded: number,
        readonly message: string,
    ) {}

    static create(eventId: UUID, photosCount: number): AddGalleryPhotosResult {
        return new AddGalleryPhotosResult(
            eventId,
            photosCount,
            `${photosCount} photo(s) added to gallery successfully`,
        );
    }
}
