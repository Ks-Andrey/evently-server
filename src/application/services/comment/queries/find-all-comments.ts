import { Result } from 'true-myth';

import { safeAsync } from '../../common';
import { CommentDTO } from '../dto/comment-dto';
import { ICommentReader } from '../interfaces/comment-reader';

export class FindAllCommentsHandler {
    constructor(private readonly commentReader: ICommentReader) {}

    execute(): Promise<Result<CommentDTO[], Error>> {
        return safeAsync(async () => {
            return await this.commentReader.findAll();
        });
    }
}
