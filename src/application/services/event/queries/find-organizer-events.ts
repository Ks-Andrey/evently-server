import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';
import { EventDTO } from '../dto/event-dto';
import { IEventReader } from '../interfaces/event-reader';

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
