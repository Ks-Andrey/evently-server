import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { ICategoryRepository } from '@domain/models/category';

import { CategoryNotFoundException } from '../exceptions';

export class EditCategory {
    constructor(
        readonly categoryId: UUID,
        readonly categoryName: string,
    ) {}
}

export class EditCategoryHandler {
    constructor(private readonly categoryRepo: ICategoryRepository) {}

    execute(command: EditCategory): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            const category = await this.categoryRepo.findById(command.categoryId);
            if (!category) throw new CategoryNotFoundException();

            category.updateName(command.categoryName);
            await this.categoryRepo.save(category);

            return category.categoryId;
        });
    }
}
