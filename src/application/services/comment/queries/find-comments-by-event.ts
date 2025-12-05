import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, PaginationParams, PaginationResult, safeAsync } from '@application/common';
import { CommentDTO, ICommentReader } from '@application/readers/comment';

export class FindCommentsByEvent {
    constructor(
        readonly eventId: UUID,
        readonly pagination: PaginationParams,
        readonly dateFrom?: string,
        readonly dateTo?: string,
    ) {}
}

export class FindCommentsByEventHandler {
    constructor(private readonly commentReader: ICommentReader) {}

    execute(query: FindCommentsByEvent): Promise<Result<PaginationResult<CommentDTO>, ApplicationException>> {
        return safeAsync(async () => {
            const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
            const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
            return await this.commentReader.findCommentsByEventId(query.eventId, query.pagination, dateFrom, dateTo);
        });
    }
}
