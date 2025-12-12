import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class DeleteCommentResult {
    private constructor(
        readonly commentId: UUID,
        readonly message: string,
    ) {}

    static create(commentId: UUID): DeleteCommentResult {
        return new DeleteCommentResult(commentId, MESSAGES.result.comment.deleted);
    }
}
