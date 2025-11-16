import { UUID } from 'crypto';

import { EventSubscriberIdCannotBeEmptyException, EventSubscriberNameCannotBeEmptyException } from '../exceptions';

export class EventUser {
    private constructor(
        private readonly _id: UUID,
        private readonly _subscriberName: string,
    ) {}

    static create(id: UUID, subscriberName: string): EventUser {
        if (!id) {
            throw new EventSubscriberIdCannotBeEmptyException();
        }

        if (!subscriberName || subscriberName.trim().length === 0) {
            throw new EventSubscriberNameCannotBeEmptyException();
        }

        return new EventUser(id, subscriberName.trim());
    }

    get id(): UUID {
        return this._id;
    }

    get subscriberName(): string {
        return this._subscriberName;
    }
}
