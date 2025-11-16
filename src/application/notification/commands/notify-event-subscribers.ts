import { ISubscriptionDao, NotFoundError } from '@domain/common';
import { IEventRepository } from '@domain/event';
import { Notification, NotificationType, NotificationUser, INotificationRepository } from '@domain/notification';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { v4 } from 'uuid';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class NotifyEventSubscribers {
    constructor(
        readonly actorId: UUID,
        readonly eventId: UUID,
        readonly message: string,
    ) {}
}

export class NotifyEventSubscribersHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly userRepo: IUserRepository,
        private readonly notificationRepo: INotificationRepository,
        private readonly subscriptionDao: ISubscriptionDao,
    ) {}

    execute(command: NotifyEventSubscribers): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const actor = await this.userRepo.findById(command.actorId);
            if (!actor) throw new NotFoundError();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundError();

            if (!actor.canManageEvents() && !event.canBeEditedBy(actor.id)) {
                throw new NotFoundError();
            }

            const subscribers = await this.subscriptionDao.findSubscribersByEventId(event.id);

            const notifications = subscribers.map((subscriber) =>
                Notification.create(
                    v4() as UUID,
                    event.id,
                    NotificationUser.create(subscriber.id, subscriber.subscriberName),
                    command.message,
                    NotificationType.EVENT_UPDATED,
                ),
            );

            for (const notification of notifications) {
                await this.notificationRepo.save(notification);
            }

            return true;
        });
    }
}
