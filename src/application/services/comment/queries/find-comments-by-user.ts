import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';
import { CommentDTO } from '../dto/comment-dto';
import { ICommentReader } from '../interfaces/comment-reader';

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
