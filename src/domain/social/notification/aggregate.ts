import { UUID } from 'crypto';

import { NotificationUser } from './entities/notification-user';
import {
    NotificationMessageCannotBeEmptyException,
    NotificationIdCannotBeEmptyException,
    NotificationEventIdCannotBeEmptyException,
    NotificationUserIsRequiredException,
    NotificationTypeCannotBeEmptyException,
} from './exceptions';
import { NotificationType } from './value-objects/notification-type';

export class Notification {
    private constructor(
        private readonly _id: UUID,
        private readonly _eventId: UUID,
        private readonly _user: NotificationUser,
        private readonly _type: NotificationType,
        private readonly _createdAt: Date,
        private _message: string,
    ) {}

    static create(
        id: UUID,
        eventId: UUID,
        user: NotificationUser,
        message: string,
        type: NotificationType,
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
        if (!message || message.trim().length === 0) {
            throw new NotificationMessageCannotBeEmptyException();
        }
        if (!type) {
            throw new NotificationTypeCannotBeEmptyException();
        }

        return new Notification(id, eventId, user, type, createdAt, message.trim());
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

    get message(): string {
        return this._message;
    }

    get type(): NotificationType {
        return this._type;
    }

    get createdAt(): Date {
        return this._createdAt;
    }
}
