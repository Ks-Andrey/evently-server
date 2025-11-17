import { CategoryInUseException, ICategoryRepository } from '@domain/category';
import { IEventRepository } from '@domain/event';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class DeleteCategory {
    constructor(readonly categoryId: UUID) {}
}

export class DeleteCategoryHandler {
    constructor(
        private readonly categoryRepo: ICategoryRepository,
        private readonly eventRepo: IEventRepository,
    ) {}

    execute(command: DeleteCategory): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const category = await this.categoryRepo.findById(command.categoryId);
            if (!category) return true;

            const eventsInCategory = await this.eventRepo.findByCategory(category.categoryId);
            if (eventsInCategory.length > 0) throw new CategoryInUseException();

            await this.categoryRepo.delete(category.categoryId);

            return true;
        });
    }
}
