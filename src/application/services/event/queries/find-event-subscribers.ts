import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';
import { EventUserDTO } from '../dto/event-user-dto';
import { IEventReader } from '../interfaces/event-reader';

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
