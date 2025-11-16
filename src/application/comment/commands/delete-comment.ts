import { ICommentRepository } from '@domain/comment';
import { NotFoundError } from '@domain/common';
import { IEventRepository } from '@domain/event';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class DeleteComment {
    constructor(
        readonly commentId: UUID,
        readonly actorId: UUID,
    ) {}
}

export class DeleteCommentHandler {
    constructor(
        private readonly commentRepo: ICommentRepository,
        private readonly eventRepo: IEventRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    execute(command: DeleteComment): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const comment = await this.commentRepo.findById(command.commentId);
            if (!comment) throw new NotFoundError();

            const actor = await this.userRepo.findById(command.actorId);
            if (!actor) throw new NotFoundError();

            if (!actor.canManageComments() && comment.author.id !== actor.id) {
                throw new NotFoundError();
            }

            const event = await this.eventRepo.findById(comment.eventId);
            if (!event) throw new NotFoundError();

            comment.delete();
            event.decrementCommentCount();

            await Promise.all([this.commentRepo.save(comment), this.eventRepo.save(event)]);

            return true;
        });
    }
}
