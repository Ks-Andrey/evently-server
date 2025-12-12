import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class NotifyEventSubscribersResult {
    private constructor(
        readonly eventId: UUID,
        readonly notifiedCount: number,
        readonly message: string,
    ) {}

    static create(eventId: UUID, notifiedCount: number): NotifyEventSubscribersResult {
        return new NotifyEventSubscribersResult(
            eventId,
            notifiedCount,
            MESSAGES.result.notification.subscribersNotified(notifiedCount),
        );
    }
}
