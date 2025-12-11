import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, PaginationParams, PaginationResult, safeAsync } from '@application/common';
import { EventDTO, IEventReader } from '@application/readers/event';

export class FindOrganizerEvents {
    constructor(
        readonly organizerId: UUID,
        readonly pagination?: PaginationParams,
        readonly dateFrom?: string,
        readonly dateTo?: string,
        readonly keyword?: string,
        readonly userId?: UUID,
    ) {}
}

export class FindOrganizerEventsHandler {
    constructor(private readonly eventReader: IEventReader) {}

    execute(query: FindOrganizerEvents): Promise<Result<PaginationResult<EventDTO>, ApplicationException>> {
        return safeAsync(async () => {
            const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
            const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
            return this.eventReader.findByOrganizer(
                query.organizerId,
                query.pagination,
                dateFrom,
                dateTo,
                query.keyword?.trim(),
                query.userId,
            );
        });
    }
}
