import { UUID } from 'crypto';

export class UploadAvatarResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): UploadAvatarResult {
        return new UploadAvatarResult(userId, 'Avatar uploaded successfully');
    }
}
