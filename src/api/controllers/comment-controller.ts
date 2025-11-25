import { UUID } from 'crypto';
import { Request, Response } from 'express';

import {
    CreateComment,
    CreateCommentHandler,
    DeleteComment,
    DeleteCommentHandler,
    EditComment,
    EditCommentHandler,
    FindAllCommentsHandler,
    FindCommentsByEvent,
    FindCommentsByEventHandler,
    FindCommentsByUser,
    FindCommentsByUserHandler,
} from '@application/services/comment';

import { handleResult } from '../utils/error-handler';

export class CommentController {
    constructor(
        private readonly findAllCommentsHandler: FindAllCommentsHandler,
        private readonly findCommentsByEventHandler: FindCommentsByEventHandler,
        private readonly findCommentsByUserHandler: FindCommentsByUserHandler,
        private readonly createCommentHandler: CreateCommentHandler,
        private readonly editCommentHandler: EditCommentHandler,
        private readonly deleteCommentHandler: DeleteCommentHandler,
    ) {}

    async getAllComments(req: Request, res: Response): Promise<void> {
        const result = await this.findAllCommentsHandler.execute();
        handleResult(result, res);
    }

    async getCommentsByEvent(req: Request, res: Response): Promise<void> {
        const { eventId } = req.params;
        const query = new FindCommentsByEvent(eventId as UUID);
        const result = await this.findCommentsByEventHandler.execute(query);
        handleResult(result, res);
    }

    async getCommentsByUser(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const query = new FindCommentsByUser(userId as UUID);
        const result = await this.findCommentsByUserHandler.execute(query);
        handleResult(result, res);
    }

    async createComment(req: Request, res: Response): Promise<void> {
        const { eventId, text } = req.body;
        const command = new CreateComment(req.user!.userId, eventId, text);
        const result = await this.createCommentHandler.execute(command);
        handleResult(result, res, 201);
    }

    async editComment(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { text } = req.body;
        const command = new EditComment(req.user!.role, req.user!.userId, id as UUID, text);
        const result = await this.editCommentHandler.execute(command);
        handleResult(result, res);
    }

    async deleteComment(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const command = new DeleteComment(req.user!.role, req.user!.userId, id as UUID);
        const result = await this.deleteCommentHandler.execute(command);
        handleResult(result, res);
    }
}
