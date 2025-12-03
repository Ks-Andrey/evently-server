import { UUID } from 'crypto';

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
            `${notifiedCount} subscriber(s) notified successfully`,
        );
    }
}
