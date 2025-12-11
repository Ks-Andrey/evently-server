import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, PaginationParams, PaginationResult, safeAsync } from '@application/common';
import { EventDTO, IEventReader, EventFilters } from '@application/readers/event';

export class FindEvents {
    constructor(
        readonly pagination: PaginationParams,
        readonly categoryId?: UUID,
        readonly dateFrom?: string,
        readonly dateTo?: string,
        readonly keyword?: string,
        readonly userId?: UUID,
    ) {}
}

export class FindEventsHandler {
    constructor(private readonly eventReader: IEventReader) {}

    execute(query: FindEvents): Promise<Result<PaginationResult<EventDTO>, ApplicationException>> {
        return safeAsync(async () => {
            const filters: EventFilters = {
                categoryId: query.categoryId,
                dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
                dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
                keyword: query.keyword?.trim(),
            };

            return await this.eventReader.findWithFilters(filters, query.pagination, query.userId);
        });
    }
}
