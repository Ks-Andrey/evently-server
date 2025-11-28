import { UUID } from 'crypto';

import { CommentUserDTO } from './comment-user-dto';

export class CommentDTO {
    private constructor(
        readonly id: UUID,
        readonly eventId: UUID,
        readonly author: CommentUserDTO,
        readonly text: string,
        readonly createdAt: Date,
    ) {}

    static create(id: UUID, eventId: UUID, author: CommentUserDTO, text: string, createdAt: Date): CommentDTO {
        return new CommentDTO(id, eventId, author, text, createdAt);
    }
}
