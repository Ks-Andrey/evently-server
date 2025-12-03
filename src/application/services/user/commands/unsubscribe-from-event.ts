import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, executeInTransaction } from '@application/common';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { IEventRepository } from '@domain/events/event';
import { IEventSubscriptionRepository } from '@domain/events/event-subscription';
import { IUserRepository } from '@domain/identity/user';

import { UnsubscribeFromEventResult } from '../dto/unsubscribe-from-event-result';
import { UserNotFoundException, EventForUserNotFoundException, UserNotSubscribedException } from '../exceptions';

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
        readonly subscriptionRepo: IEventSubscriptionRepository,
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: UnsubscribeUserFromEvent): Promise<Result<UnsubscribeFromEventResult, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventForUserNotFoundException();

            const isSubscribed = await this.subscriptionRepo.isUserSubscribedToEvent(user.id, event.id);
            if (!isSubscribed) throw new UserNotSubscribedException();

            event.decrementSubscriberCount();
            user.decrementSubscriptionCount();

            await this.subscriptionRepo.removeSubscription(user.id, event.id);

            await this.eventRepo.save(event);
            await this.userRepo.save(user);

            return UnsubscribeFromEventResult.create(user.id, event.id);
        });
    }
}
