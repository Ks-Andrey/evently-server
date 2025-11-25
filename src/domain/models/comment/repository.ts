import { IRepository } from '@common/types/repository';

import { Comment } from './aggregate';

export interface ICommentRepository extends IRepository<Comment> {}
