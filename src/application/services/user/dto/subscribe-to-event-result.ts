import { UUID } from 'crypto';

export class SubscribeToEventResult {
    private constructor(
        readonly userId: UUID,
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID, eventId: UUID): SubscribeToEventResult {
        return new SubscribeToEventResult(userId, eventId, 'Subscribed to event successfully');
    }
}
