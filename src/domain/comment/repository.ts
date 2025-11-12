import { UUID } from 'crypto';

import { Comment } from './aggregate';

import { IRepository } from '../../common/types/repository';

export interface ICommentRepository extends IRepository<Comment> {
    findCommentByUserId(userId: UUID): Promise<Comment | null>;
    findCommentsByEventId(eventId: UUID): Promise<Comment[]>;
    findAllCommentsByUserId(userId: UUID): Promise<Comment[]>;
}
