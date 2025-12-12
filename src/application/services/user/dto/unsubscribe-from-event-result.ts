import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class UnsubscribeFromEventResult {
    private constructor(
        readonly userId: UUID,
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID, eventId: UUID): UnsubscribeFromEventResult {
        return new UnsubscribeFromEventResult(userId, eventId, MESSAGES.result.subscription.unsubscribed);
    }
}
