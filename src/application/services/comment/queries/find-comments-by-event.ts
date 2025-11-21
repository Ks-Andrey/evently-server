import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';
import { CommentDTO } from '../dto/comment-dto';
import { ICommentReader } from '../interfaces/comment-reader';

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
