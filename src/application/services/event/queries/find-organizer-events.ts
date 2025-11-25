import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { EventDTO, IEventReader } from '@application/readers/event';

export class FindOrganizerEvents {
    constructor(readonly organizerId: UUID) {}
}

export class FindOrganizerEventsHandler {
    constructor(private readonly eventReader: IEventReader) {}

    execute(query: FindOrganizerEvents): Promise<Result<EventDTO[], ApplicationException>> {
        return safeAsync(async () => {
            return this.eventReader.findByOrganizer(query.organizerId);
        });
    }
}
