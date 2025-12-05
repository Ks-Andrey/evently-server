import { UUID } from 'crypto';

import { CommentUserDTO } from './comment-user-dto';

export class CommentDTO {
    private constructor(
        readonly id: UUID,
        readonly author: CommentUserDTO,
        readonly text: string,
        readonly createdAt: Date,
    ) {}

    static create(id: UUID, author: CommentUserDTO, text: string, createdAt: Date): CommentDTO {
        return new CommentDTO(id, author, text, createdAt);
    }
}
