import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { EventUserDTO, IEventReader } from '@application/queries/event';
import { safeAsync } from '@application/services/common';

export class FindEventSubscribers {
    constructor(readonly eventId: UUID) {}
}

export class FindEventSubscribersHandler {
    constructor(private readonly eventReader: IEventReader) {}

    execute(query: FindEventSubscribers): Promise<Result<EventUserDTO[], Error>> {
        return safeAsync(async () => {
            return await this.eventReader.findEventUsers(query.eventId);
        });
    }
}
