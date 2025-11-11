import { UUID } from 'crypto';

import { CommentUser } from './entities/comment-user';
import {
    CommentTextCannotBeEmptyException,
    CannotEditDeletedCommentException,
    CommentAlreadyDeletedException,
} from './exceptions';

export class Comment {
    public isDeleted: boolean = false;

    constructor(
        public readonly id: UUID,
        public readonly eventId: UUID,
        public readonly userId: CommentUser,
        public text: string,
        public readonly createdAt: Date = new Date(),
    ) {
        if (!text || text.trim().length === 0) {
            throw new CommentTextCannotBeEmptyException();
        }
    }

    edit(newText: string): void {
        if (this.isDeleted) {
            throw new CannotEditDeletedCommentException();
        }
        if (!newText || newText.trim().length === 0) {
            throw new CommentTextCannotBeEmptyException();
        }
        this.text = newText;
    }

    delete(): void {
        if (this.isDeleted) {
            throw new CommentAlreadyDeletedException();
        }
        this.isDeleted = true;
    }
}
