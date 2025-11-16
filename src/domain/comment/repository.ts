import { UUID } from 'crypto';

import { Comment } from './aggregate';

import { IRepository } from '../../common/types/repository';

export interface ICommentRepository extends IRepository<Comment> {
    findAll(): Promise<Comment[]>;
    findCommentsByEventId(eventId: UUID): Promise<Comment[]>;
    findAllCommentsByUserId(userId: UUID): Promise<Comment[]>;
}
