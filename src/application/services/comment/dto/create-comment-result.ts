import { UUID } from 'crypto';

export class CreateCommentResult {
    private constructor(
        readonly commentId: UUID,
        readonly message: string,
    ) {}

    static create(commentId: UUID): CreateCommentResult {
        return new CreateCommentResult(commentId, 'Comment created successfully');
    }
}
