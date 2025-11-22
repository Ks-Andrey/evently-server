import { Result } from 'true-myth';

import { CommentDTO, ICommentReader } from '@application/queries/comment';
import { safeAsync } from '@application/services/common';

export class FindAllCommentsHandler {
    constructor(private readonly commentReader: ICommentReader) {}

    execute(): Promise<Result<CommentDTO[], Error>> {
        return safeAsync(async () => {
            return await this.commentReader.findAll();
        });
    }
}
