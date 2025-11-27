import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, ApplicationException } from '@application/common';
import { ICategoryReader } from '@application/readers/category';
import { IUserReader } from '@application/readers/user';
import { Roles } from '@common/constants/roles';
import { EventCategory, IEventRepository } from '@domain/models/event';

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

            const isAdmin = command.role === Roles.ADMIN;
            const isOwner = event.canEditedBy(requestUser.id);

            if (!isAdmin && !isOwner) throw new AccessDeniedException();

            event.updateDetails(command.title, command.description, command.date, command.location);

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
