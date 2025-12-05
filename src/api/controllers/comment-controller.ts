import { Request, Response } from 'express';

import {
    CreateCommentHandler,
    DeleteCommentHandler,
    EditCommentHandler,
    FindAllCommentsHandler,
    FindCommentByIdHandler,
    FindCommentsByEventHandler,
    FindCommentsByUserHandler,
} from '@application/services/comment';

import { handleResult } from '../common/utils/error-handler';
import { CommentMapper } from '../mappers';

export class CommentController {
    constructor(
        private readonly findAllCommentsHandler: FindAllCommentsHandler,
        private readonly findCommentByIdHandler: FindCommentByIdHandler,
        private readonly findCommentsByEventHandler: FindCommentsByEventHandler,
        private readonly findCommentsByUserHandler: FindCommentsByUserHandler,
        private readonly createCommentHandler: CreateCommentHandler,
        private readonly editCommentHandler: EditCommentHandler,
        private readonly deleteCommentHandler: DeleteCommentHandler,
    ) {}

    async getAllComments(req: Request, res: Response): Promise<void> {
        const query = CommentMapper.toFindAllCommentsQuery(req);
        const result = await this.findAllCommentsHandler.execute(query);
        handleResult(result, res);
    }

    async getCommentById(req: Request, res: Response): Promise<void> {
        const query = CommentMapper.toFindCommentByIdQuery(req);
        const result = await this.findCommentByIdHandler.execute(query);
        handleResult(result, res);
    }

    async getCommentsByEvent(req: Request, res: Response): Promise<void> {
        const query = CommentMapper.toFindCommentsByEventQuery(req);
        const result = await this.findCommentsByEventHandler.execute(query);
        handleResult(result, res);
    }

    async getCommentsByUser(req: Request, res: Response): Promise<void> {
        const query = CommentMapper.toFindCommentsByUserQuery(req);
        const result = await this.findCommentsByUserHandler.execute(query);
        handleResult(result, res);
    }

    async createComment(req: Request, res: Response): Promise<void> {
        const command = CommentMapper.toCreateCommentCommand(req);
        const result = await this.createCommentHandler.execute(command);
        handleResult(result, res, 201);
    }

    async editComment(req: Request, res: Response): Promise<void> {
        const command = CommentMapper.toEditCommentCommand(req);
        const result = await this.editCommentHandler.execute(command);
        handleResult(result, res);
    }

    async deleteComment(req: Request, res: Response): Promise<void> {
        const command = CommentMapper.toDeleteCommentCommand(req);
        const result = await this.deleteCommentHandler.execute(command);
        handleResult(result, res);
    }
}
