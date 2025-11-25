import { UUID } from 'crypto';

import { CommentUserIdCannotBeEmptyException, CommentUsernameCannotBeEmptyException } from '../exceptions';

export class CommentUser {
    private constructor(
        private readonly _id: UUID,
        private readonly _username: string,
    ) {}

    static create(id: UUID, username: string) {
        if (!id || id.trim().length === 0) {
            throw new CommentUserIdCannotBeEmptyException();
        }
        if (!username || username.trim().length === 0) {
            throw new CommentUsernameCannotBeEmptyException();
        }

        return new CommentUser(id, username.trim());
    }

    get id(): string {
        return this._id;
    }

    get username(): string {
        return this._username;
    }
}
