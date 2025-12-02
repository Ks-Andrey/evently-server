import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, executeInTransaction } from '@application/common';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { IEventRepository } from '@domain/events/event';
import { IUserRepository } from '@domain/identity/user';

import { UserNotFoundException, EventForUserNotFoundException, UserNotSubscribedException } from '../exceptions';
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
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: UnsubscribeUserFromEvent): Promise<Result<boolean, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventForUserNotFoundException();

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
