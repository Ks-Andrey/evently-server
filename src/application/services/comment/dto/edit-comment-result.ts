import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class EditCommentResult {
    private constructor(
        readonly commentId: UUID,
        readonly message: string,
    ) {}

    static create(commentId: UUID): EditCommentResult {
        return new EditCommentResult(commentId, MESSAGES.result.comment.updated);
    }
}
