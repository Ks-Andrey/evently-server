import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, ApplicationException } from '@application/common';
import { Roles } from '@common/config/roles';
import { ICommentRepository } from '@domain/models/comment';
import { IEventRepository } from '@domain/models/event';
import { IUserRepository } from '@domain/models/user';

import {
    CommentNotFoundException,
    UserForCommentNotFoundException,
    EventForCommentNotFoundException,
} from '../exceptions';

export class DeleteComment {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly commentId: UUID,
    ) {}
}

export class DeleteCommentHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly commentRepo: ICommentRepository,
        private readonly eventRepo: IEventRepository,
    ) {}

    execute(command: DeleteComment): Promise<Result<boolean, ApplicationException>> {
        return safeAsync(async () => {
            const requestUser = await this.userRepo.findById(command.userId);
            if (!requestUser) throw new UserForCommentNotFoundException();

            if (requestUser.isBlocked) throw new AccessDeniedException();

            const comment = await this.commentRepo.findById(command.commentId);
            if (!comment) throw new CommentNotFoundException();

            const isAdmin = command.role === Roles.ADMIN;
            const isOwner = comment.canEditedBy(requestUser.id);

            if (!isAdmin && !isOwner) throw new AccessDeniedException();

            const event = await this.eventRepo.findById(comment.eventId);
            if (!event) throw new EventForCommentNotFoundException();

            event.decrementCommentCount();

            await this.commentRepo.delete(comment.id);
            await this.eventRepo.save(event);

            return true;
        });
    }
}
