import { ICommentRepository, Comment } from '@domain/comment';
import { NotFoundException } from '@domain/common';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class FindCommentsByUser {
    constructor(readonly userId: UUID) {}
}

export class FindCommentsByUserHandler {
    constructor(
        private readonly commentsRepo: ICommentRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    execute(command: FindCommentsByUser): Promise<Result<Comment[], Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();

            return await this.commentsRepo.findCommentsByEventId(user.id);
        });
    }
}
