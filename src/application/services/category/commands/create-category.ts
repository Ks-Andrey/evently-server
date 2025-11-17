import { CategoryAlreadyExistsException, Category, ICategoryRepository } from '@domain/category';
import { Result } from 'true-myth';

import { v4 } from 'uuid';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class CreateCategory {
    constructor(readonly name: string) {}
}

export class CreateCategoryHandler {
    constructor(private readonly categoryRepo: ICategoryRepository) {}

    execute(command: CreateCategory): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const existing = await this.categoryRepo.findByName(command.name.trim());
            if (existing) throw new CategoryAlreadyExistsException();

            const category = Category.create(v4() as UUID, command.name);
            await this.categoryRepo.save(category);

            return category.categoryId;
        });
    }
}
