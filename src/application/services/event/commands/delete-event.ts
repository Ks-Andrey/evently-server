import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, NotFoundException } from '@application/services/common';
import { Roles } from '@common/config/roles';
import { IEventRepository } from '@domain/event';
import { IUserRepository } from '@domain/user';

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

    execute(command: DeleteEvent): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const requestUser = await this.userRepo.findById(command.userId);
            if (!requestUser) throw new NotFoundException();

            if (requestUser.isBlocked) {
                throw new AccessDeniedException();
            }

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundException();

            const isAdmin = command.role === Roles.ADMIN;
            const isOwner = event.canEditedBy(requestUser.id);

            if (!isAdmin && !isOwner) {
                throw new AccessDeniedException();
            }

            await this.eventRepo.delete(event.id);

            return true;
        });
    }
}
