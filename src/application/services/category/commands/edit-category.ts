import { ICategoryRepository } from '@domain/category';
import { NotFoundException } from '@domain/common';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class EditCategory {
    constructor(
        readonly categoryId: UUID,
        readonly categoryName: string,
    ) {}
}

export class EditCategoryHandler {
    constructor(private readonly categoryRepo: ICategoryRepository) {}

    execute(command: EditCategory): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const category = await this.categoryRepo.findById(command.categoryId);
            if (!category) throw new NotFoundException();

            category.updateName(command.categoryName);
            await this.categoryRepo.save(category);

            return category.categoryId;
        });
    }
}
