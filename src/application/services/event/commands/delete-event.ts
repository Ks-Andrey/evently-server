import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, ApplicationException } from '@application/common';
import { IUserReader } from '@application/readers/user';
import { Roles } from '@common/constants/roles';
import { IEventRepository } from '@domain/events/event';

import { DeleteEventResult } from '../dto/delete-event-result';
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
        private readonly userReader: IUserReader,
        private readonly eventRepo: IEventRepository,
    ) {}

    execute(command: DeleteEvent): Promise<Result<DeleteEventResult, ApplicationException>> {
        return safeAsync(async () => {
            const requestUser = await this.userReader.findById(command.userId);
            if (!requestUser) throw new UserForEventNotFoundException();

            if (requestUser.isBlocked) throw new AccessDeniedException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventNotFoundException();

            const isAdmin = command.role === Roles.ADMIN;
            const isOwner = event.canEditedBy(requestUser.id);

            if (!isAdmin && !isOwner) throw new AccessDeniedException();

            await this.eventRepo.delete(event.id);

            return DeleteEventResult.create(event.id);
        });
    }
}
