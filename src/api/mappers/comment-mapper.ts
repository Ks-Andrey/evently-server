import { UUID } from 'crypto';
import { Request } from 'express';

import { NotAuthenticatedException } from '@application/common';
import {
    CreateComment,
    DeleteComment,
    EditComment,
    FindCommentsByEvent,
    FindCommentsByUser,
} from '@application/services/comment';

export class CommentMapper {
    static toFindCommentsByEventQuery(req: Request): FindCommentsByEvent {
        const { eventId } = req.params;
        return new FindCommentsByEvent(eventId as UUID);
    }

    static toFindCommentsByUserQuery(req: Request): FindCommentsByUser {
        const { userId } = req.params;
        return new FindCommentsByUser(userId as UUID);
    }

    static toCreateCommentCommand(req: Request): CreateComment {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { eventId, text } = req.body;
        return new CreateComment(req.user.userId, eventId, text);
    }

    static toEditCommentCommand(req: Request): EditComment {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { id } = req.params;
        const { text } = req.body;
        return new EditComment(req.user.role, req.user.userId, id as UUID, text);
    }

    static toDeleteCommentCommand(req: Request): DeleteComment {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { id } = req.params;
        return new DeleteComment(req.user.role, req.user.userId, id as UUID);
    }
}
