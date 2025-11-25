import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { safeAsync } from '@application/common';
import { NotFoundException } from '@application/common/exceptions/exceptions';
import { IEventReader } from '@application/readers/event';
import { Notification, NotificationType, NotificationUser, INotificationRepository } from '@domain/models/notification';

export class NotifyEventSubscribers {
    constructor(
        readonly eventId: UUID,
        readonly message: string,
    ) {}
}

export class NotifyEventSubscribersHandler {
    constructor(
        private readonly eventReader: IEventReader,
        private readonly notificationRepo: INotificationRepository,
    ) {}

    execute(command: NotifyEventSubscribers): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const event = await this.eventReader.findById(command.eventId);
            if (!event) throw new NotFoundException();

            const subscribers = await this.eventReader.findEventUsers(event.id);

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
