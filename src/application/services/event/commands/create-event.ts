import { UUID } from 'crypto';

import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { ICategoryReader } from '@application/queries/category';
import { IUserReader } from '@application/queries/user';
import { safeAsync, NotFoundException } from '@application/services/common';
import { Event, EventCategory, EventOrganizer, IEventRepository } from '@domain/event';

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
        private readonly categoryReader: ICategoryReader,
        private readonly userReader: IUserReader,
    ) {}

    execute(command: CreateEvent): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const actor = await this.userReader.findById(command.userId);
            if (!actor) throw new NotFoundException();

            const category = await this.categoryReader.findById(command.categoryId);
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
