import { NotFoundError } from '@domain/common';
import { IEventRepository } from '@domain/event';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class DeleteEvent {
    constructor(
        readonly actorId: UUID,
        readonly eventId: UUID,
    ) {}
}

export class DeleteEventHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    execute(command: DeleteEvent): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const actor = await this.userRepo.findById(command.actorId);
            if (!actor) throw new NotFoundError();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundError();

            if (!actor.canManageEvents() && !event.canBeEditedBy(actor.id)) {
                throw new NotFoundError();
            }

            await this.eventRepo.delete(event.id);
            return true;
        });
    }
}
