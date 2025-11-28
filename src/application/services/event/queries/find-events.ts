import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { EventDTO, IEventReader, EventFilters } from '@application/readers/event';

export class FindEvents {
    constructor(
        readonly categoryId?: UUID,
        readonly dateFrom?: Date,
        readonly dateTo?: Date,
        readonly keyword?: string,
    ) {}
}

export class FindEventsHandler {
    constructor(private readonly eventReader: IEventReader) {}

    execute(query: FindEvents): Promise<Result<EventDTO[], ApplicationException>> {
        return safeAsync(async () => {
            const filters: EventFilters = {
                categoryId: query.categoryId,
                dateFrom: query.dateFrom,
                dateTo: query.dateTo,
                keyword: query.keyword?.trim() || undefined,
            };

            return await this.eventReader.findWithFilters(filters);
        });
    }
}
