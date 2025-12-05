import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { CommentDTO, ICommentReader } from '@application/readers/comment';

import { CommentNotFoundException } from '../exceptions';

export class FindCommentById {
    constructor(readonly commentId: UUID) {}
}

export class FindCommentByIdHandler {
    constructor(private readonly commentReader: ICommentReader) {}

    execute(query: FindCommentById): Promise<Result<CommentDTO, ApplicationException>> {
        return safeAsync(async () => {
            const comment = await this.commentReader.findById(query.commentId);
            if (!comment) throw new CommentNotFoundException();

            return comment;
        });
    }
}
