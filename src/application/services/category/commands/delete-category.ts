import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { IEventReader } from '@application/readers/event';
import { ICategoryRepository } from '@domain/events/category';

import { CategoryInUseException, CategoryNotFoundException } from '../exceptions';

export class DeleteCategory {
    constructor(readonly categoryId: UUID) {}
}

export class DeleteCategoryHandler {
    constructor(
        private readonly categoryRepo: ICategoryRepository,
        private readonly eventReader: IEventReader,
    ) {}

    execute(command: DeleteCategory): Promise<Result<boolean, ApplicationException>> {
        return safeAsync(async () => {
            const category = await this.categoryRepo.findById(command.categoryId);
            if (!category) throw new CategoryNotFoundException();

            const eventsInCategory = await this.eventReader.findByCategory(category.categoryId);
            if (eventsInCategory.length > 0) throw new CategoryInUseException();

            await this.categoryRepo.delete(category.categoryId);

            return true;
        });
    }
}
