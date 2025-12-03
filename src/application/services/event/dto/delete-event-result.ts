import { UUID } from 'crypto';

export class DeleteEventResult {
    private constructor(
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(eventId: UUID): DeleteEventResult {
        return new DeleteEventResult(eventId, 'Event deleted successfully');
    }
}
