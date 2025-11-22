import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { EventDTO, IEventReader } from '@application/queries/event';
import { safeAsync } from '@application/services/common';

export class FindOrganizerEvents {
    constructor(readonly organizerId: UUID) {}
}

export class FindOrganizerEventsHandler {
    constructor(private readonly eventReader: IEventReader) {}

    execute(query: FindOrganizerEvents): Promise<Result<EventDTO[], Error>> {
        return safeAsync(async () => {
            return this.eventReader.findByOrganizer(query.organizerId);
        });
    }
}
