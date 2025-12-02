import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, ApplicationException } from '@application/common';
import { ICategoryReader } from '@application/readers/category';
import { IUserReader } from '@application/readers/user';
import { Roles } from '@common/constants/roles';
import { EventCategory, EventLocation, IEventRepository } from '@domain/events/event';

import {
    EventNotFoundException,
    UserForEventNotFoundException,
    CategoryForEventNotFoundException,
} from '../exceptions';

export class EditEventDetails {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly eventId: UUID,
        readonly title?: string,
        readonly description?: string,
        readonly date?: Date,
        readonly location?: string,
        readonly latitude?: number,
        readonly longitude?: number,
        readonly categoryId?: UUID,
    ) {}
}

export class EditEventDetailsHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly userRepo: IUserReader,
        private readonly categoryRepo: ICategoryReader,
    ) {}

    execute(command: EditEventDetails): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            const requestUser = await this.userRepo.findById(command.userId);
            if (!requestUser) throw new UserForEventNotFoundException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new EventNotFoundException();

            if (command.role !== Roles.ADMIN && !event.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            let eventLocation = event.location;
            if (command.location !== undefined && command.latitude !== undefined && command.longitude !== undefined) {
                eventLocation = EventLocation.create(command.location, command.longitude, command.latitude);
            }

            event.updateDetails(command.title, command.description, command.date, eventLocation);

            if (command.categoryId) {
                const category = await this.categoryRepo.findById(command.categoryId);
                if (!category) throw new CategoryForEventNotFoundException();

                const categoryEntity = EventCategory.create(category.categoryId, category.categoryName);
                event.changeCategory(categoryEntity);
            }

            await this.eventRepo.save(event);

            return event.id;
        });
    }
}
