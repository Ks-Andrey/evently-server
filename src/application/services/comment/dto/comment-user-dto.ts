import { UUID } from 'crypto';

export class CommentUserDTO {
    private constructor(
        readonly id: UUID,
        readonly username: string,
    ) {}
}
