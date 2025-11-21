import { UUID } from 'crypto';

import { NotificationUserIdCannotBeEmptyException, NotificationUsernameCannotBeEmptyException } from '../exceptions';

export class NotificationUser {
    private constructor(
        private readonly _id: UUID,
        private readonly _username: string,
    ) {}

    static create(id: UUID, username: string) {
        if (!id || id.trim().length === 0) {
            throw new NotificationUserIdCannotBeEmptyException();
        }
        if (!username || username.trim().length === 0) {
            throw new NotificationUsernameCannotBeEmptyException();
        }

        return new NotificationUser(id, username.trim());
    }

    get id(): string {
        return this._id;
    }

    get username(): string {
        return this._username;
    }
}
