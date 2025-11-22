import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { CommentDTO, ICommentReader } from '@application/queries/comment';
import { safeAsync } from '@application/services/common';

export class FindCommentsByEvent {
    constructor(readonly eventId: UUID) {}
}

export class FindCommentsByEventHandler {
    constructor(private readonly commentReader: ICommentReader) {}

    execute(query: FindCommentsByEvent): Promise<Result<CommentDTO[], Error>> {
        return safeAsync(async () => {
            return await this.commentReader.findCommentsByEventId(query.eventId);
        });
    }
}
