import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { executeInTransaction, AccessDeniedException, ApplicationException } from '@application/common';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { IEventRepository } from '@domain/events/event';
import { IUserRepository } from '@domain/identity/user';
import { Comment, CommentUser, ICommentRepository } from '@domain/social/comment';

import { CreateCommentResult } from '../dto/create-comment-result';
import { UserForCommentNotFoundException, EventForCommentNotFoundException } from '../exceptions';

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
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: CreateComment): Promise<Result<CreateCommentResult, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserForCommentNotFoundException();

            if (user.isBlocked) throw new AccessDeniedException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventForCommentNotFoundException();

            const commentUser = CommentUser.create(user.id, user.username);
            const comment = Comment.create(v4() as UUID, event.id, commentUser, command.text);

            event.incrementCommentCount();

            await this.commentRepo.save(comment);
            await this.eventRepo.save(event);

            return CreateCommentResult.create(comment.id);
        });
    }
}
