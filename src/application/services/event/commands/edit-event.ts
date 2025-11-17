import { ICategoryRepository } from '@domain/category';
import { NotFoundException } from '@domain/common';
import { EventCategory, IEventRepository } from '@domain/event';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class UpdateEventDetails {
    constructor(
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
    ) {}

    execute(command: UpdateEventDetails): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const event = await this.eventRepo.findById(command.eventId);
            if (!event) throw new NotFoundException();

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
