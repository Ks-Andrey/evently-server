import { UUID } from 'crypto';

import { CommentDTO } from './dto/comment-dto';

export interface ICommentReader {
    findAll(): Promise<CommentDTO[]>;
    findById(commentId: UUID): Promise<CommentDTO | null>;
    findCommentsByEventId(eventId: UUID): Promise<CommentDTO[]>;
    findAllCommentsByUserId(userId: UUID): Promise<CommentDTO[]>;
}
