import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, ApplicationException } from '@application/common';
import { Roles } from '@common/constants/roles';
import { IUserRepository } from '@domain/identity/user';
import { ICommentRepository } from '@domain/social/comment';

import { EditCommentResult } from '../dto/edit-comment-result';
import { CommentNotFoundException, UserForCommentNotFoundException } from '../exceptions';

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

    execute(command: EditComment): Promise<Result<EditCommentResult, ApplicationException>> {
        return safeAsync(async () => {
            const requestUser = await this.userRepo.findById(command.userId);
            if (!requestUser) throw new UserForCommentNotFoundException();

            if (requestUser.isBlocked) {
                throw new AccessDeniedException();
            }

            const comment = await this.commentRepo.findById(command.commentId);
            if (!comment) throw new CommentNotFoundException();

            const isAdmin = command.role === Roles.ADMIN;
            const isOwner = comment.canEditedBy(requestUser.id);

            if (!isAdmin && !isOwner) {
                throw new AccessDeniedException();
            }

            comment.edit(command.newText);
            await this.commentRepo.save(comment);

            return EditCommentResult.create(comment.id);
        });
    }
}
