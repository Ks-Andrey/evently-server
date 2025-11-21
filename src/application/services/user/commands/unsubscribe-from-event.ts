import { NotFoundException } from '@domain/common';
import { IEventRepository, UserNotSubscribedException } from '@domain/event';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';
import { ISubscriptionManager } from '../interfaces/subscription-manager';

export class UnsubscribeUserFromEvent {
    constructor(
        readonly userId: UUID,
        readonly eventId: UUID,
    ) {}
}

export class UnsubscribeUserFromEventHandler {
    constructor(
        readonly userRepo: IUserRepository,
        readonly eventRepo: IEventRepository,
        readonly subscriptionManager: ISubscriptionManager,
    ) {}

    execute(command: UnsubscribeUserFromEvent): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundException();

            const isSubscribed = await this.subscriptionManager.hasSubscribed(event.id, user.id);
            if (!isSubscribed) throw new UserNotSubscribedException();

            event.decrementSubscriberCount();
            user.decrementSubscriptionCount();

            await this.subscriptionManager.unsubscribe(event.id, user.id);

            await this.eventRepo.save(event);
            await this.userRepo.save(user);

            return true;
        });
    }
}
