import { UUID } from 'crypto';

import { CommentUser } from './entities/comment-user';
import {
    CommentTextCannotBeEmptyException,
    CannotEditDeletedCommentException,
    CommentAlreadyDeletedException,
    CommentIdCannotBeEmptyException,
    CommentEventIdCannotBeEmptyException,
    CommentAuthorIsRequiredException,
} from './exceptions';

export class Comment {
    private constructor(
        private readonly _id: UUID,
        private readonly _eventId: UUID,
        private readonly _author: CommentUser,
        private _text: string,
        private readonly _createdAt: Date,
        private _isDeleted: boolean,
    ) {}

    static create(id: UUID, eventId: UUID, author: CommentUser, text: string, createdAt: Date = new Date()) {
        if (!id) {
            throw new CommentIdCannotBeEmptyException();
        }
        if (!eventId) {
            throw new CommentEventIdCannotBeEmptyException();
        }
        if (!author) {
            throw new CommentAuthorIsRequiredException();
        }
        this.ensureValidText(text);

        return new Comment(id, eventId, author, text.trim(), createdAt, false);
    }

    get id(): UUID {
        return this._id;
    }

    get eventId(): UUID {
        return this._eventId;
    }

    get author(): CommentUser {
        return this._author;
    }

    get userId(): CommentUser {
        return this._author;
    }

    get text(): string {
        return this._text;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    edit(newText: string): void {
        if (this._isDeleted) {
            throw new CannotEditDeletedCommentException();
        }
        Comment.ensureValidText(newText);
        this._text = newText.trim();
    }

    delete(): void {
        if (this._isDeleted) {
            throw new CommentAlreadyDeletedException();
        }
        this._isDeleted = true;
    }

    isCommentator(userId: UUID): boolean {
        return this._author.id === userId;
    }

    private static ensureValidText(text: string): void {
        if (!text || text.trim().length === 0) {
            throw new CommentTextCannotBeEmptyException();
        }
    }
}
