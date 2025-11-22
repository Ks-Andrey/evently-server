import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { safeAsync, NotFoundException, AccessDeniedException } from '@application/services/common';
import { Roles } from '@common/config/roles';
import { ICommentRepository } from '@domain/comment';
import { IUserRepository } from '@domain/user';

export class EditComment {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly commentId: UUID,
        readonly newText: string,
    ) {}
}

export class EditCommentHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly commentRepo: ICommentRepository,
    ) {}

    execute(command: EditComment): Promise<Result<UUID, Error>> {
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

            comment.edit(command.newText);
            await this.commentRepo.save(comment);

            return comment.id;
        });
    }
}
