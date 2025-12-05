import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { ApplicationException, safeAsync } from '@application/common';
import { ICategoryReader } from '@application/readers/category';
import { IUserReader } from '@application/readers/user';
import { Event, EventCategory, EventOrganizer, EventLocation, IEventRepository } from '@domain/events/event';

import { CreateEventResult } from '../dto/create-event-result';
import { UserForEventNotFoundException, CategoryForEventNotFoundException } from '../exceptions';

export class CreateEvent {
    constructor(
        readonly userId: UUID,
        readonly categoryId: UUID,
        readonly title: string,
        readonly description: string,
        readonly date: Date,
        readonly location: string,
        readonly latitude: number,
        readonly longitude: number,
    ) {}
}

export class CreateEventHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly categoryReader: ICategoryReader,
        private readonly userReader: IUserReader,
    ) {}

    execute(command: CreateEvent): Promise<Result<CreateEventResult, ApplicationException>> {
        return safeAsync(async () => {
            const actor = await this.userReader.findById(command.userId);
            if (!actor) throw new UserForEventNotFoundException();

            const category = await this.categoryReader.findById(command.categoryId);
            if (!category) throw new CategoryForEventNotFoundException();

            const organizer = EventOrganizer.create(actor.id, actor.username, actor.personalData);
            const eventCategory = EventCategory.create(category.id, category.name);
            const eventLocation = EventLocation.create(command.location, command.longitude, command.latitude);

            const event = Event.create(
                v4() as UUID,
                organizer,
                eventCategory,
                command.title,
                command.description,
                command.date,
                eventLocation,
            );

            await this.eventRepo.save(event);

            return CreateEventResult.create(event.id);
        });
    }
}
