import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, executeInTransaction } from '@application/common';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { IEventRepository } from '@domain/events/event';
import { IUserRepository } from '@domain/identity/user';

import { UserNotFoundException, EventForUserNotFoundException, UserAlreadySubscribedException } from '../exceptions';
import { ISubscriptionManager } from '../interfaces/subscription-manager';

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
        readonly subscriptionManager: ISubscriptionManager,
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: SubscribeUserToEvent): Promise<Result<boolean, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventForUserNotFoundException();

            const alreadySubscribed = await this.subscriptionManager.hasSubscribed(event.id, user.id);
            if (alreadySubscribed) throw new UserAlreadySubscribedException();

            event.incrementSubscriberCount();
            user.incrementSubscriptionCount();

            await this.subscriptionManager.subscribe(event.id, user.id);

            await this.eventRepo.save(event);
            await this.userRepo.save(user);

            return true;
        });
    }
}
