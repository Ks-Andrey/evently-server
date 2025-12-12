import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class ToggleBlockUserResult {
    private constructor(
        readonly userId: UUID,
        readonly isBlocked: boolean,
        readonly message: string,
    ) {}

    static create(userId: UUID, isBlocked: boolean): ToggleBlockUserResult {
        const message = isBlocked ? MESSAGES.result.user.blocked : MESSAGES.result.user.unblocked;
        return new ToggleBlockUserResult(userId, isBlocked, message);
    }
}
