import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class EditUserPasswordResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): EditUserPasswordResult {
        return new EditUserPasswordResult(userId, MESSAGES.result.user.passwordUpdated);
    }
}
