import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, ApplicationException } from '@application/common';
import { Roles } from '@common/config/roles';
import { IEventRepository } from '@domain/models/event';
import { IUserRepository } from '@domain/models/user';

import { EventNotFoundException, UserForEventNotFoundException } from '../exceptions';

export class DeleteEvent {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly eventId: UUID,
    ) {}
}

export class DeleteEventHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly eventRepo: IEventRepository,
    ) {}

    execute(command: DeleteEvent): Promise<Result<boolean, ApplicationException>> {
        return safeAsync(async () => {
            const requestUser = await this.userRepo.findById(command.userId);
            if (!requestUser) throw new UserForEventNotFoundException();

            if (requestUser.isBlocked) throw new AccessDeniedException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventNotFoundException();

            const isAdmin = command.role === Roles.ADMIN;
            const isOwner = event.canEditedBy(requestUser.id);

            if (!isAdmin && !isOwner) throw new AccessDeniedException();

            await this.eventRepo.delete(event.id);

            return true;
        });
    }
}
