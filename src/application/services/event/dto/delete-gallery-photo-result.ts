import { UUID } from 'crypto';

export class DeleteGalleryPhotoResult {
    private constructor(
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(eventId: UUID): DeleteGalleryPhotoResult {
        return new DeleteGalleryPhotoResult(eventId, 'Gallery photo deleted successfully');
    }
}
