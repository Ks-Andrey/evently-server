import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class ConfirmEmailResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): ConfirmEmailResult {
        return new ConfirmEmailResult(userId, MESSAGES.result.auth.emailConfirmed);
    }
}
