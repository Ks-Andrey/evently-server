import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { safeAsync, NotFoundException, AccessDeniedException } from '@application/services/common';
import { Roles } from '@common/config/roles';
import { ICommentRepository } from '@domain/comment';
import { IEventRepository } from '@domain/event';
import { IUserRepository } from '@domain/user';

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

    execute(command: DeleteComment): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const requestUser = await this.userRepo.findById(command.userId);
            if (!requestUser) throw new NotFoundException();

            if (requestUser.isBlocked) {
                throw new AccessDeniedException();
            }

            const comment = await this.commentRepo.findById(command.commentId);
            if (!comment) throw new NotFoundException();

            const isAdmin = command.role === Roles.ADMIN;
            const isOwner = comment.canEditedBy(requestUser.id);

            if (!isAdmin && !isOwner) {
                throw new AccessDeniedException();
            }

            const event = await this.eventRepo.findById(comment.eventId);
            if (!event) throw new NotFoundException();

            event.decrementCommentCount();

            await this.commentRepo.delete(comment.id);
            await this.eventRepo.save(event);

            return true;
        });
    }
}
