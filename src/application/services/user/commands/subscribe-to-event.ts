import { ISubscriptionDao, NotFoundException } from '@domain/common';
import { EventAlreadyStartedException, IEventRepository, UserAlreadySubscribedException } from '@domain/event';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class SubscribeUserToEvent {
    constructor(
        readonly userId: UUID,
        readonly eventId: UUID,
    ) {}
}

export class SubscribeUserToEventHandler {
    constructor(
        readonly userRepo: IUserRepository,
        readonly eventRepo: IEventRepository,
        readonly subscriptionDao: ISubscriptionDao,
    ) {}

    execute(command: SubscribeUserToEvent): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundException();

            if (event.hasStarted()) throw new EventAlreadyStartedException();

            const alreadySubscribed = await this.subscriptionDao.hasSubscribed(event.id, user.id);
            if (alreadySubscribed) throw new UserAlreadySubscribedException();

            event.incrementSubscriberCount();
            user.incrementSubscriptionCount();

            await this.subscriptionDao.subscribe(event.id, user.id);
            await this.eventRepo.save(event);
            await this.userRepo.save(user);

            return true;
        });
    }
}
