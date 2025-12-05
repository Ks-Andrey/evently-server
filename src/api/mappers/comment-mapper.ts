import { UUID } from 'crypto';
import { Request } from 'express';

import { NotAuthenticatedException } from '@application/common';
import {
    CreateComment,
    DeleteComment,
    EditComment,
    FindAllComments,
    FindCommentById,
    FindCommentsByEvent,
    FindCommentsByUser,
} from '@application/services/comment';

import { parsePaginationParams } from '../common/utils/pagination';

export class CommentMapper {
    static toFindCommentByIdQuery(req: Request): FindCommentById {
        const { id } = req.params;
        return new FindCommentById(id as UUID);
    }
    static toFindAllCommentsQuery(req: Request): FindAllComments {
        const pagination = parsePaginationParams(req);
        const { dateFrom, dateTo } = req.query;
        return new FindAllComments(pagination, dateFrom as string, dateTo as string);
    }

    static toFindCommentsByEventQuery(req: Request): FindCommentsByEvent {
        const { eventId } = req.params;
        const pagination = parsePaginationParams(req);
        const { dateFrom, dateTo } = req.query;
        return new FindCommentsByEvent(eventId as UUID, pagination, dateFrom as string, dateTo as string);
    }

    static toFindCommentsByUserQuery(req: Request): FindCommentsByUser {
        const { userId } = req.params;
        const pagination = parsePaginationParams(req);
        const { dateFrom, dateTo } = req.query;
        return new FindCommentsByUser(userId as UUID, pagination, dateFrom as string, dateTo as string);
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
