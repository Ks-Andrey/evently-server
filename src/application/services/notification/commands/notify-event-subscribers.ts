import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { ApplicationException, executeInTransaction } from '@application/common';
import { IEventReader } from '@application/readers/event';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { log } from '@common/utils/logger';
import { Notification, NotificationType, NotificationUser, INotificationRepository } from '@domain/social/notification';

import { NotifyEventSubscribersResult } from '../dto/notify-event-subscribers-result';
import { EventForNotificationNotFoundException } from '../exceptions';
import { IBotManager } from '../interfaces/bot-manager';

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
        private readonly unitOfWork: IUnitOfWork,
        private readonly botManager: IBotManager,
    ) {}

    execute(command: NotifyEventSubscribers): Promise<Result<NotifyEventSubscribersResult, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const event = await this.eventReader.findById(command.eventId);
            if (!event) throw new EventForNotificationNotFoundException();

            const subscribers = await this.eventReader.findEventUsers(event.id);

            const notifications = subscribers.map((subscriber) =>
                Notification.create(
                    v4() as UUID,
                    event.id,
                    NotificationUser.create(subscriber.id, subscriber.name),
                    command.message,
                    NotificationType.EVENT_UPDATED,
                ),
            );

            for (const notification of notifications) {
                await this.notificationRepo.save(notification);

                try {
                    await this.botManager.sendMessage(notification.user.id, notification.message);
                } catch (error) {
                    log.error('Error send telegram message', { error });
                }
            }

            return NotifyEventSubscribersResult.create(event.id, notifications.length);
        });
    }
}
