import { UUID } from 'crypto';

export class EditEventResult {
    private constructor(
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(eventId: UUID): EditEventResult {
        return new EditEventResult(eventId, 'Event updated successfully');
    }
}
