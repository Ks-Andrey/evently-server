import { ICommentRepository } from '@domain/comment';
import { NotFoundError } from '@domain/common';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class EditComment {
    constructor(
        readonly commentId: UUID,
        readonly actorId: UUID,
        readonly newText: string,
    ) {}
}

export class EditCommentHandler {
    constructor(
        private readonly commentRepo: ICommentRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    execute(command: EditComment): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const comment = await this.commentRepo.findById(command.commentId);
            if (!comment) throw new NotFoundError();

            const actor = await this.userRepo.findById(command.actorId);
            if (!actor) throw new NotFoundError();

            if (!actor.canManageComments() && comment.author.id !== actor.id) {
                throw new NotFoundError();
            }

            comment.edit(command.newText);

            await this.commentRepo.save(comment);

            return comment.id;
        });
    }
}
