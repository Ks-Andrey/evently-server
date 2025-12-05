import { UUID } from 'crypto';

import { PaginationParams, PaginationResult } from '@application/common';

import { CommentDTO } from './dto/comment-dto';

export interface ICommentReader {
    findAll(pagination: PaginationParams, dateFrom?: Date, dateTo?: Date): Promise<PaginationResult<CommentDTO>>;
    findById(commentId: UUID): Promise<CommentDTO | null>;
    findCommentsByEventId(
        eventId: UUID,
        pagination: PaginationParams,
        dateFrom?: Date,
        dateTo?: Date,
    ): Promise<PaginationResult<CommentDTO>>;
    findAllCommentsByUserId(
        userId: UUID,
        pagination: PaginationParams,
        dateFrom?: Date,
        dateTo?: Date,
    ): Promise<PaginationResult<CommentDTO>>;
}
