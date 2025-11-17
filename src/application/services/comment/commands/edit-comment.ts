import { ICommentRepository } from '@domain/comment';
import { NotFoundException } from '@domain/common';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class EditComment {
    constructor(
        readonly commentId: UUID,
        readonly newText: string,
    ) {}
}

export class EditCommentHandler {
    constructor(private readonly commentRepo: ICommentRepository) {}

    execute(command: EditComment): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const comment = await this.commentRepo.findById(command.commentId);
            if (!comment) throw new NotFoundException();

            comment.edit(command.newText);

            await this.commentRepo.save(comment);

            return comment.id;
        });
    }
}
