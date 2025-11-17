import { NotFoundException } from '@domain/common';
import { IEventRepository } from '@domain/event';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class DeleteEvent {
    constructor(readonly eventId: UUID) {}
}

export class DeleteEventHandler {
    constructor(private readonly eventRepo: IEventRepository) {}

    execute(command: DeleteEvent): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundException();

            await this.eventRepo.delete(event.id);
            return true;
        });
    }
}
