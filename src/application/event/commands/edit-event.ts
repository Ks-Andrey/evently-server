import { ICategoryRepository } from '@domain/category';
import { NotFoundError } from '@domain/common';
import { EventCategory, IEventRepository } from '@domain/event';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class UpdateEventDetails {
    constructor(
        readonly actorId: UUID,
        readonly eventId: UUID,
        readonly title?: string,
        readonly description?: string,
        readonly date?: Date,
        readonly location?: string,
        readonly categoryId?: UUID,
    ) {}
}

export class UpdateEventDetailsHandler {
    constructor(
        private readonly eventRepo: IEventRepository,
        private readonly categoryRepo: ICategoryRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    execute(command: UpdateEventDetails): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const actor = await this.userRepo.findById(command.actorId);
            if (!actor) throw new NotFoundError();

            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundError();

            if (!actor.canManageEvents() && !event.canBeEditedBy(actor.id)) {
                throw new NotFoundError();
            }

            if (command.title || command.description || command.date || command.location) {
                event.updateDetails(
                    command.title ?? event.title,
                    command.description ?? event.description,
                    command.date ?? event.date,
                    command.location ?? event.location,
                );
            }

            if (command.categoryId) {
                const category = await this.categoryRepo.findById(command.categoryId);
                if (!category) throw new NotFoundError();

                const categoryEntity = EventCategory.create(category.categoryId, category.categoryName);
                event.changeCategory(categoryEntity);
            }

            await this.eventRepo.save(event);

            return event.id;
        });
    }
}
