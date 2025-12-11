import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { EventDTO, IEventReader } from '@application/readers/event';

import { EventNotFoundException } from '../exceptions';

export class FindEventById {
    constructor(
        readonly eventId: UUID,
        readonly userId?: UUID,
    ) {}
}

export class FindEventByIdHandler {
    constructor(private readonly eventReader: IEventReader) {}

    execute(query: FindEventById): Promise<Result<EventDTO, ApplicationException>> {
        return safeAsync(async () => {
            const event = await this.eventReader.findById(query.eventId, query.userId);
            if (!event) throw new EventNotFoundException();
            return event;
        });
    }
}
