import { CommentUserIdCannotBeEmptyException, CommentUsernameCannotBeEmptyException } from '../exceptions';

export class CommentUser {
    private readonly _id: string;
    private readonly _username: string;

    constructor(id: string, username: string) {
        if (!id || id.trim().length === 0) {
            throw new CommentUserIdCannotBeEmptyException();
        }
        if (!username || username.trim().length === 0) {
            throw new CommentUsernameCannotBeEmptyException();
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
