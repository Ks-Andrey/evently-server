import { NotFoundError } from '@domain/common';
import { IEventRepository } from '@domain/event';
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
    ) {}

    execute(command: SubscribeUserToEvent): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundError();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundError();

            event.incrementSubscriberCount();
            user.incrementSubscriptionCount();

            return true;
        });
    }
}
