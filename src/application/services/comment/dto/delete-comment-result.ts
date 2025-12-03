import { UUID } from 'crypto';

export class DeleteCommentResult {
    private constructor(
        readonly commentId: UUID,
        readonly message: string,
    ) {}

    static create(commentId: UUID): DeleteCommentResult {
        return new DeleteCommentResult(commentId, 'Comment deleted successfully');
    }
}
