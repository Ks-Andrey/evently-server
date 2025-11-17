import { Roles } from '@common/config/roles';
import { ICommentRepository } from '@domain/comment';
import { NotFoundException, NotRightsException } from '@domain/common';
import { IEventRepository } from '@domain/event';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

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

            // Если есть поле блокировки — это правильное место
            if (requestUser.isBlocked) {
                throw new NotRightsException();
            }

            const comment = await this.commentRepo.findById(command.commentId);
            if (!comment) throw new NotFoundException();

            const isAdmin = command.role === Roles.ADMIN;
            const isOwner = comment.canEditedBy(requestUser.id);

            if (!isAdmin && !isOwner) {
                throw new NotRightsException();
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
