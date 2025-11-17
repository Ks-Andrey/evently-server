import { ICategoryRepository } from '@domain/category';
import { NotFoundException } from '@domain/common';
import { Event, EventCategory, EventOrganizer, IEventRepository } from '@domain/event';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { v4 } from 'uuid';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class CreateEvent {
    constructor(
        readonly userId: UUID,
        readonly categoryId: UUID,
        readonly title: string,
        readonly description: string,
        readonly date: Date,
        readonly location: string,
    ) {}
}

export class CreateEventHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly categoryRepo: ICategoryRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    execute(command: CreateEvent): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const actor = await this.userRepo.findById(command.userId);
            if (!actor) throw new NotFoundException();

            const category = await this.categoryRepo.findById(command.categoryId);
            if (!category) throw new NotFoundException();

            const organizer = EventOrganizer.create(actor.id, actor.username, actor.personalData);
            const eventCategory = EventCategory.create(category.categoryId, category.categoryName);

            const event = Event.create(
                v4() as UUID,
                organizer,
                eventCategory,
                command.title,
                command.description,
                command.date,
                command.location,
            );

            await this.eventRepo.save(event);

            return event.id;
        });
    }
}
