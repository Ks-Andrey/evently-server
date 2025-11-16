import { IEventRepository } from '@domain/event';
import { Event } from '@domain/event';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class FindEvents {
    constructor(
        readonly categoryId?: UUID,
        readonly dateFrom?: Date,
        readonly dateTo?: Date,
        readonly keyword?: string,
    ) {}
}

export class FindEventsHandler {
    constructor(private readonly eventRepo: IEventRepository) {}

    execute(query: FindEvents): Promise<Result<Event[], Error>> {
        return safeAsync(async () => {
            let events = await this.eventRepo.findAll();

            if (query.categoryId) {
                events = events.filter((event) => event.category.categoryId === query.categoryId);
            }

            if (query.dateFrom) {
                const fromTime = query.dateFrom.getTime();
                events = events.filter((event) => event.date.getTime() >= fromTime);
            }

            if (query.dateTo) {
                const toTime = query.dateTo.getTime();
                events = events.filter((event) => event.date.getTime() <= toTime);
            }

            if (query.keyword && query.keyword.trim().length > 0) {
                const keyword = query.keyword.trim().toLowerCase();
                events = events.filter(
                    (event) =>
                        event.title.toLowerCase().includes(keyword) ||
                        event.description.toLowerCase().includes(keyword) ||
                        event.location.toLowerCase().includes(keyword),
                );
            }

            return events;
        });
    }
}
