import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { CommentDTO, ICommentReader } from '@application/readers/comment';

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
