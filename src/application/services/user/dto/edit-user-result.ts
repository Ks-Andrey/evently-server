import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class EditUserResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): EditUserResult {
        return new EditUserResult(userId, MESSAGES.result.user.updated);
    }
}
