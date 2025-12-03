import { UUID } from 'crypto';

export class CreateEventResult {
    private constructor(
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(eventId: UUID): CreateEventResult {
        return new CreateEventResult(eventId, 'Event created successfully');
    }
}
