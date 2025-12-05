import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, PaginationParams, PaginationResult, safeAsync } from '@application/common';
import { EventUserDTO, IEventReader } from '@application/readers/event';

export class FindEventSubscribers {
    constructor(
        readonly eventId: UUID,
        readonly pagination?: PaginationParams,
        readonly search?: string,
    ) {}
}

export class FindEventSubscribersHandler {
    constructor(private readonly eventReader: IEventReader) {}

    execute(query: FindEventSubscribers): Promise<Result<PaginationResult<EventUserDTO>, ApplicationException>> {
        return safeAsync(async () => {
            return await this.eventReader.findEventUsers(query.eventId, query.pagination, query.search);
        });
    }
}
