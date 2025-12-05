import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, PaginationParams, PaginationResult, safeAsync } from '@application/common';
import { CommentDTO, ICommentReader } from '@application/readers/comment';

export class FindCommentsByUser {
    constructor(
        readonly userId: UUID,
        readonly pagination: PaginationParams,
        readonly dateFrom?: string,
        readonly dateTo?: string,
    ) {}
}

export class FindCommentsByUserHandler {
    constructor(private readonly commentReader: ICommentReader) {}

    execute(query: FindCommentsByUser): Promise<Result<PaginationResult<CommentDTO>, ApplicationException>> {
        return safeAsync(async () => {
            const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
            const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
            return await this.commentReader.findAllCommentsByUserId(query.userId, query.pagination, dateFrom, dateTo);
        });
    }
}
