import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { NotFoundException, AccessDeniedException } from '@application/common/exceptions';
import { Roles } from '@common/config/roles';
import { ICategoryRepository } from '@domain/models/category';
import { EventCategory, IEventRepository } from '@domain/models/event';
import { IUserRepository } from '@domain/models/user';

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
        private readonly userRepo: IUserRepository,
        private readonly eventRepo: IEventRepository,
        private readonly categoryRepo: ICategoryRepository,
    ) {}

    execute(command: EditEventDetails): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const requestUser = await this.userRepo.findById(command.userId);
            if (!requestUser) throw new NotFoundException();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundException();

            const isAdmin = command.role === Roles.ADMIN;
            const isOwner = event.canEditedBy(requestUser.id);

            if (!isAdmin && !isOwner) {
                throw new AccessDeniedException();
            }

            event.updateDetails(command.title, command.description, command.date, command.location);

            if (command.categoryId) {
                const category = await this.categoryRepo.findById(command.categoryId);
                if (!category) throw new NotFoundException();

                const categoryEntity = EventCategory.create(category.categoryId, category.categoryName);
                event.changeCategory(categoryEntity);
            }

            await this.eventRepo.save(event);

            return event.id;
        });
    }
}
