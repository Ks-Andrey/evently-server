import { ICommentRepository, Comment } from '@domain/comment';
import { Result } from 'true-myth';

import { safeAsync } from '../../common';

export class FindAllCommentsHandler {
    constructor(private readonly commentsRepo: ICommentRepository) {}

    execute(): Promise<Result<Comment[], Error>> {
        return safeAsync(async () => {
            return await this.commentsRepo.findAll();
        });
    }
}
