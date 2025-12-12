import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class EditUserEmailResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): EditUserEmailResult {
        return new EditUserEmailResult(userId, MESSAGES.result.user.emailUpdated);
    }
}
