import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, executeInTransaction } from '@application/common';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { IEventRepository } from '@domain/events/event';
import { IEventSubscriptionRepository } from '@domain/events/event-subscription';
import { IUserRepository } from '@domain/identity/user';

import { SubscribeToEventResult } from '../dto/subscribe-to-event-result';
import { UserNotFoundException, EventForUserNotFoundException, UserAlreadySubscribedException } from '../exceptions';

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
        readonly subscriptionRepo: IEventSubscriptionRepository,
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: SubscribeUserToEvent): Promise<Result<SubscribeToEventResult, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventForUserNotFoundException();

            const alreadySubscribed = await this.subscriptionRepo.isUserSubscribedToEvent(user.id, event.id);
            if (alreadySubscribed) throw new UserAlreadySubscribedException();

            event.incrementSubscriberCount();
            user.incrementSubscriptionCount();

            await this.subscriptionRepo.createSubscription(user.id, event.id);

            await this.eventRepo.save(event);
            await this.userRepo.save(user);

            return SubscribeToEventResult.create(user.id, event.id);
        });
    }
}
