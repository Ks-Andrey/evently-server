import { NotFoundException } from '@domain/common';
import { IEventRepository } from '@domain/event';
import { Event } from '@domain/event';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class FindOrganizerEvents {
    constructor(readonly organizerId: UUID) {}
}

export class FindOrganizerEventsHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    execute(query: FindOrganizerEvents): Promise<Result<Event[], Error>> {
        return safeAsync(async () => {
            const organizer = await this.userRepo.findById(query.organizerId);
            if (!organizer) throw new NotFoundException();

            return this.eventRepo.findByOrganizerId(organizer.id);
        });
    }
}
