import { ICommentRepository, Comment } from '@domain/comment';
import { NotFoundError } from '@domain/common';
import { IEventRepository } from '@domain/event';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class FindCommentsByEvent {
    constructor(readonly eventId: UUID) {}
}

export class FindCommentsByEventHandler {
    constructor(
        private readonly commentsRepo: ICommentRepository,
        private readonly eventRepo: IEventRepository,
    ) {}

    execute(command: FindCommentsByEvent): Promise<Result<Comment[], Error>> {
        return safeAsync(async () => {
            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundError();

            return await this.commentsRepo.findCommentsByEventId(event.id);
        });
    }
}
