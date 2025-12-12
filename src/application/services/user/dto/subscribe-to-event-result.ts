import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class SubscribeToEventResult {
    private constructor(
        readonly userId: UUID,
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID, eventId: UUID): SubscribeToEventResult {
        return new SubscribeToEventResult(userId, eventId, MESSAGES.result.subscription.subscribed);
    }
}
