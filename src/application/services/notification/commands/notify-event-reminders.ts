import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { ApplicationException, executeInTransaction, PaginationParams } from '@application/common';
import { IEventReader, EventFilters } from '@application/readers/event';
import { MESSAGES } from '@common/constants/messages';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { log } from '@common/utils/logger';
import { Notification, NotificationType, NotificationUser, INotificationRepository } from '@domain/social/notification';

import { NotifyEventRemindersResult } from '../dto/notify-event-reminders-result';
import { IBotManager } from '../interfaces/bot-manager';

export class NotifyEventReminders {
    constructor() {}
}

export class NotifyEventRemindersHandler {
    constructor(
        private readonly eventReader: IEventReader,
        private readonly notificationRepo: INotificationRepository,
        private readonly unitOfWork: IUnitOfWork,
        private readonly botManager: IBotManager,
    ) {}

    execute(_command: NotifyEventReminders): Promise<Result<NotifyEventRemindersResult, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const now = new Date();
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
            const oneHourAndFiveMinutesFromNow = new Date(now.getTime() + 65 * 60 * 1000);

            const filters: EventFilters = {
                dateFrom: oneHourFromNow,
                dateTo: oneHourAndFiveMinutesFromNow,
            };

            const pagination: PaginationParams = {
                page: 1,
                pageSize: 1000, // Большое значение для получения всех событий в диапазоне
            };

            const eventsResult = await this.eventReader.findAll(filters, pagination);
            const events = eventsResult.data;

            let totalNotified = 0;
            const eventResults: Array<{ eventId: UUID; notifiedCount: number }> = [];

            for (const event of events) {
                const subscribers = await this.eventReader.findEventUsers(event.id);

                if (subscribers.data.length === 0) {
                    continue;
                }

                const message = MESSAGES.notification.eventReminder(event.title, event.location.location);

                const notifications = subscribers.data.map((subscriber) =>
                    Notification.create(
                        v4() as UUID,
                        event.id,
                        NotificationUser.create(subscriber.id, subscriber.name),
                        message,
                        NotificationType.EVENT_REMINDER,
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

                totalNotified += notifications.length;
                eventResults.push({ eventId: event.id, notifiedCount: notifications.length });
            }

            return NotifyEventRemindersResult.create(totalNotified, eventResults);
        });
    }
}
