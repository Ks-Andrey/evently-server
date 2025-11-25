import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { CommentDTO, ICommentReader } from '@application/readers/comment';

export class FindAllCommentsHandler {
    constructor(private readonly commentReader: ICommentReader) {}

    execute(): Promise<Result<CommentDTO[], Error>> {
        return safeAsync(async () => {
            return await this.commentReader.findAll();
        });
    }
}
