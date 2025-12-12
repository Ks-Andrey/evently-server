import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class DeleteAvatarResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): DeleteAvatarResult {
        return new DeleteAvatarResult(userId, MESSAGES.result.user.avatarDeleted);
    }
}
