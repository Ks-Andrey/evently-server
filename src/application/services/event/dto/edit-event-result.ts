import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class EditEventResult {
    private constructor(
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(eventId: UUID): EditEventResult {
        return new EditEventResult(eventId, MESSAGES.result.event.updated);
    }
}
