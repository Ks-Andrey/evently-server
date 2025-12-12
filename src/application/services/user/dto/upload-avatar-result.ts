import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class UploadAvatarResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): UploadAvatarResult {
        return new UploadAvatarResult(userId, MESSAGES.result.user.avatarUploaded);
    }
}
