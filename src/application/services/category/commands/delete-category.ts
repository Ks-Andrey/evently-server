import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { ConflictException, NotFoundException } from '@application/common/exceptions/exceptions';
import { IEventReader } from '@application/readers/event';
import { ICategoryRepository } from '@domain/models/category';

export class DeleteCategory {
    constructor(readonly categoryId: UUID) {}
}

export class DeleteCategoryHandler {
    constructor(
        private readonly categoryRepo: ICategoryRepository,
        private readonly eventReader: IEventReader,
    ) {}

    execute(command: DeleteCategory): Promise<Result<boolean, Error>> {
        return safeAsync(async () => {
            const category = await this.categoryRepo.findById(command.categoryId);
            if (!category) throw new NotFoundException();

            const eventsInCategory = await this.eventReader.findByCategory(category.categoryId);
            if (eventsInCategory.length > 0) throw new ConflictException();

            await this.categoryRepo.delete(category.categoryId);

            return true;
        });
    }
}
