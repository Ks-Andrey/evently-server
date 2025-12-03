import { UUID } from 'crypto';

export class UnsubscribeFromEventResult {
    private constructor(
        readonly userId: UUID,
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID, eventId: UUID): UnsubscribeFromEventResult {
        return new UnsubscribeFromEventResult(userId, eventId, 'Unsubscribed from event successfully');
    }
}
