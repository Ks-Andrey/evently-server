import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { CommentDTO, ICommentReader } from '@application/readers/comment';

export class FindCommentsByUser {
    constructor(readonly userId: UUID) {}
}

export class FindCommentsByUserHandler {
    constructor(private readonly commentReader: ICommentReader) {}

    execute(query: FindCommentsByUser): Promise<Result<CommentDTO[], ApplicationException>> {
        return safeAsync(async () => {
            return await this.commentReader.findCommentsByEventId(query.userId);
        });
    }
}
