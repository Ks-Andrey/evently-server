import { UUID } from 'crypto';

import { NotificationUser } from './entities/notification-user';
import {
    NotificationAlreadySentException,
    NotificationMessageCannotBeEmptyException,
    NotificationIdCannotBeEmptyException,
    NotificationEventIdCannotBeEmptyException,
    NotificationUserIsRequiredException,
    NotificationTypeCannotBeEmptyException,
} from './exceptions';

export enum NotificationType {
    EVENT_UPDATED = 'EVENT_UPDATED',
    EVENT_REMINDER = 'EVENT_REMINDER',
    EVENT_CANCELLED = 'EVENT_CANCELLED',
}

export class Notification {
    private readonly _id: UUID;
    private readonly _eventId: UUID;
    private readonly _user: NotificationUser;
    private readonly _type: NotificationType;
    private readonly _createdAt: Date;
    private _message: string;
    private _isSent: boolean;

    constructor(
        id: UUID,
        eventId: UUID,
        user: NotificationUser,
        message: string,
        type: NotificationType,
        isSent: boolean = false,
        createdAt: Date = new Date(),
    ) {
        if (!id) {
            throw new NotificationIdCannotBeEmptyException();
        }
        if (!eventId) {
            throw new NotificationEventIdCannotBeEmptyException();
        }
        if (!user) {
            throw new NotificationUserIsRequiredException();
        }
        this.ensureValidMessage(message);
        if (!type) {
            throw new NotificationTypeCannotBeEmptyException();
        }

        this._id = id;
        this._eventId = eventId;
        this._user = user;
        this._message = message.trim();
        this._type = type;
        this._isSent = isSent;
        this._createdAt = createdAt;
    }

    get id(): UUID {
        return this._id;
    }

    get eventId(): UUID {
        return this._eventId;
    }

    get user(): NotificationUser {
        return this._user;
    }

    get userId(): NotificationUser {
        return this._user;
    }

    get message(): string {
        return this._message;
    }

    get type(): NotificationType {
        return this._type;
    }

    get isSent(): boolean {
        return this._isSent;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    updateMessage(newMessage: string): void {
        this.ensureValidMessage(newMessage);
        this._message = newMessage.trim();
    }

    markAsSent(): void {
        if (this._isSent) {
            throw new NotificationAlreadySentException();
        }
        this._isSent = true;
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

    private ensureValidMessage(message: string): void {
        if (!message || message.trim().length === 0) {
            throw new NotificationMessageCannotBeEmptyException();
        }
    }
}
