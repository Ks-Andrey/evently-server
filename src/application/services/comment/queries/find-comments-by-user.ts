import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { CommentDTO, ICommentReader } from '@application/queries/comment';
import { safeAsync } from '@application/services/common';

export class FindCommentsByUser {
    constructor(readonly userId: UUID) {}
}

export class FindCommentsByUserHandler {
    constructor(private readonly commentReader: ICommentReader) {}

    execute(query: FindCommentsByUser): Promise<Result<CommentDTO[], Error>> {
        return safeAsync(async () => {
            return await this.commentReader.findCommentsByEventId(query.userId);
        });
    }
}
