import { ISubscriptionDao, NotFoundException } from '@domain/common';
import { EventUser, IEventRepository } from '@domain/event';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class FindEventSubscribers {
    constructor(readonly eventId: UUID) {}
}

export class FindEventSubscribersHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly subscriptionDao: ISubscriptionDao,
    ) {}

    execute(query: FindEventSubscribers): Promise<Result<EventUser[], Error>> {
        return safeAsync(async () => {
            const event = await this.eventRepo.findById(query.eventId);
            if (!event) throw new NotFoundException();

            return await this.subscriptionDao.findSubscribersByEventId(event.id);
        });
    }
}
