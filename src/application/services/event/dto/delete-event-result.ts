import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class DeleteEventResult {
    private constructor(
        readonly eventId: UUID,
        readonly message: string,
    ) {}

    static create(eventId: UUID): DeleteEventResult {
        return new DeleteEventResult(eventId, MESSAGES.result.event.deleted);
    }
}
