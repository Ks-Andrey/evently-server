import { Result } from 'true-myth';

import { ApplicationException, PaginationParams, PaginationResult, safeAsync } from '@application/common';
import { CommentDTO, ICommentReader } from '@application/readers/comment';

export class FindAllComments {
    constructor(
        readonly pagination: PaginationParams,
        readonly dateFrom?: string,
        readonly dateTo?: string,
    ) {}
}

export class FindAllCommentsHandler {
    constructor(private readonly commentReader: ICommentReader) {}

    execute(query: FindAllComments): Promise<Result<PaginationResult<CommentDTO>, ApplicationException>> {
        return safeAsync(async () => {
            const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
            const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
            return await this.commentReader.findAll(query.pagination, dateFrom, dateTo);
        });
    }
}
