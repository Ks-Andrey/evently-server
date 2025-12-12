import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class NotifyEventRemindersResult {
    private constructor(
        readonly totalNotified: number,
        readonly eventResults: Array<{ eventId: UUID; notifiedCount: number }>,
        readonly message: string,
    ) {}

    static create(
        totalNotified: number,
        eventResults: Array<{ eventId: UUID; notifiedCount: number }>,
    ): NotifyEventRemindersResult {
        return new NotifyEventRemindersResult(
            totalNotified,
            eventResults,
            MESSAGES.result.notification.remindersSent(totalNotified, eventResults.length),
        );
    }
}
