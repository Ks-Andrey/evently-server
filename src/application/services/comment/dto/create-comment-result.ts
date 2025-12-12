import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class CreateCommentResult {
    private constructor(
        readonly commentId: UUID,
        readonly message: string,
    ) {}

    static create(commentId: UUID): CreateCommentResult {
        return new CreateCommentResult(commentId, MESSAGES.result.comment.created);
    }
}
