import { Roles } from '@common/config/roles';
import { ICommentRepository } from '@domain/comment';
import { NotFoundException, NotRightsException } from '@domain/common';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

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
                throw new NotRightsException();
            }

            const comment = await this.commentRepo.findById(command.commentId);
            if (!comment) throw new NotFoundException();

            const isAdmin = command.role === Roles.ADMIN;
            const isOwner = comment.canEditedBy(requestUser.id);

            if (!isAdmin && !isOwner) {
                throw new NotRightsException();
            }

            comment.edit(command.newText);
            await this.commentRepo.save(comment);

            return comment.id;
        });
    }
}
