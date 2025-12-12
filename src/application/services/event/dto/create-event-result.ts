import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class CreateEventResult {
    private constructor(
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(eventId: UUID): CreateEventResult {
        return new CreateEventResult(eventId, MESSAGES.result.event.created);
    }
}
