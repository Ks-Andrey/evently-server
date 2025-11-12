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
    private readonly _id: UUID;
    private readonly _eventId: UUID;
    private readonly _author: CommentUser;
    private readonly _createdAt: Date;
    private _text: string;
    private _isDeleted: boolean;

    constructor(id: UUID, eventId: UUID, author: CommentUser, text: string, createdAt: Date = new Date()) {
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

        this._id = id;
        this._eventId = eventId;
        this._author = author;
        this._text = text.trim();
        this._createdAt = createdAt;
        this._isDeleted = false;
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
        this.ensureValidText(newText);
        this._text = newText.trim();
    }

    delete(): void {
        if (this._isDeleted) {
            throw new CommentAlreadyDeletedException();
        }
        this._isDeleted = true;
    }

    private ensureValidText(text: string): void {
        if (!text || text.trim().length === 0) {
            throw new CommentTextCannotBeEmptyException();
        }
    }
}
