import { ICommentRepository } from '@domain/comment';
import { NotFoundException } from '@domain/common';
import { IEventRepository } from '@domain/event';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class DeleteComment {
    constructor(readonly commentId: UUID) {}
}

export class DeleteCommentHandler {
    constructor(
        private readonly commentRepo: ICommentRepository,
        private readonly eventRepo: IEventRepository,
    ) {}

    execute(command: DeleteComment): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const comment = await this.commentRepo.findById(command.commentId);
            if (!comment) throw new NotFoundException();

            const event = await this.eventRepo.findById(comment.eventId);
            if (!event) throw new NotFoundException();

            comment.delete();
            event.decrementCommentCount();

            await this.commentRepo.save(comment);
            await this.eventRepo.save(event);

            return true;
        });
    }
}
