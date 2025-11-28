import { UUID } from 'crypto';

export class CommentUserDTO {
    private constructor(
        readonly id: UUID,
        readonly username: string,
        readonly avatarUrl?: string,
    ) {}

    static create(id: UUID, username: string, avatarUrl?: string): CommentUserDTO {
        return new CommentUserDTO(id, username, avatarUrl);
    }
}
