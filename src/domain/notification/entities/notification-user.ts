import { NotificationUserIdCannotBeEmptyException, NotificationUsernameCannotBeEmptyException } from '../exceptions';

export class NotificationUser {
    private readonly _id: string;
    private readonly _username: string;

    constructor(id: string, username: string) {
        if (!id || id.trim().length === 0) {
            throw new NotificationUserIdCannotBeEmptyException();
        }
        if (!username || username.trim().length === 0) {
            throw new NotificationUsernameCannotBeEmptyException();
        }

        this._id = id;
        this._username = username.trim();
    }

    get id(): string {
        return this._id;
    }

    get username(): string {
        return this._username;
    }
}
