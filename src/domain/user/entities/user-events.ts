import { UUID } from 'crypto';

import {
    UserEventIdCannotBeEmptyException,
    UserEventNameCannotBeEmptyException,
    UserEventSubscriptionsCountCannotBeNegativeException,
} from '../exceptions';

export class UserEvent {
    private constructor(
        private readonly _id: UUID,
        private readonly _eventName: string,
        private readonly _subscriptionsCount: number,
    ) {}

    static create(id: UUID, eventName: string, subscriptionsCount: number): UserEvent {
        if (!id) {
            throw new UserEventIdCannotBeEmptyException();
        }

        if (!eventName || eventName.trim().length === 0) {
            throw new UserEventNameCannotBeEmptyException();
        }

        if (subscriptionsCount < 0) {
            throw new UserEventSubscriptionsCountCannotBeNegativeException();
        }

        return new UserEvent(id, eventName.trim(), subscriptionsCount);
    }

    get id(): UUID {
        return this._id;
    }

    get eventName(): string {
        return this._eventName;
    }

    get subscriptionsCount(): number {
        return this._subscriptionsCount;
    }
}
