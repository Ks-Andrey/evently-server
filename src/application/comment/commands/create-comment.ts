import { Comment, CommentUser, ICommentRepository } from '@domain/comment';
import { NotFoundError } from '@domain/common';
import { IEventRepository } from '@domain/event';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { v4 } from 'uuid';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class CreateComment {
    constructor(
        readonly userId: UUID,
        readonly eventId: UUID,
        readonly text: string,
    ) {}
}

export class CreateCommentHandler {
    constructor(
        private readonly commentRepo: ICommentRepository,
        private readonly eventRepo: IEventRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    execute(command: CreateComment): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundError();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundError();

            const commentUser = CommentUser.create(user.id, user.username);

            const comment = Comment.create(v4() as UUID, event.id, commentUser, command.text);

            event.incrementCommentCount();

            await this.commentRepo.save(comment);
            await this.eventRepo.save(event);

            return comment.id;
        });
    }
}
