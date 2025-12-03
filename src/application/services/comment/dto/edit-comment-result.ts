import { UUID } from 'crypto';

export class EditCommentResult {
    private constructor(
        readonly commentId: UUID,
        readonly message: string,
    ) {}

    static create(commentId: UUID): EditCommentResult {
        return new EditCommentResult(commentId, 'Comment updated successfully');
    }
}
