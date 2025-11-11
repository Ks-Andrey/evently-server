import { UUID } from 'crypto';

import { NotificationUser } from './entities/notification-user';
import { NotificationAlreadySentException, NotificationMessageCannotBeEmptyException } from './exceptions';

export enum NotificationType {
    EVENT_UPDATED = 'EVENT_UPDATED',
    EVENT_REMINDER = 'EVENT_REMINDER',
    EVENT_CANCELLED = 'EVENT_CANCELLED',
}

export class Notification {
    public readonly createdAt: Date = new Date();

    constructor(
        public readonly id: UUID,
        public readonly eventId: UUID,
        public readonly userId: NotificationUser,
        public message: string,
        public type: NotificationType,
        public isSent: boolean = false,
    ) {
        if (!message || message.trim().length === 0) {
            throw new NotificationMessageCannotBeEmptyException();
        }
    }

    markAsSent(): void {
        if (this.isSent) {
            throw new NotificationAlreadySentException();
        }
        this.isSent = true;
    }

    static createEventUpdatedNotification(
        id: UUID,
        eventId: UUID,
        user: NotificationUser,
        eventTitle: string,
    ): Notification {
        return new Notification(id, eventId, user, eventTitle, NotificationType.EVENT_UPDATED);
    }

    static createEventReminderNotification(
        id: UUID,
        eventId: UUID,
        user: NotificationUser,
        eventTitle: string,
    ): Notification {
        return new Notification(id, eventId, user, eventTitle, NotificationType.EVENT_REMINDER);
    }

    static createEventCancelledNotification(
        id: UUID,
        eventId: UUID,
        user: NotificationUser,
        eventTitle: string,
    ): Notification {
        return new Notification(id, eventId, user, eventTitle, NotificationType.EVENT_CANCELLED);
    }
}
