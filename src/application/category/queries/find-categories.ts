import { Category, ICategoryRepository } from '@domain/category';
import { Result } from 'true-myth';

import { safeAsync } from '../../common';

export class FindCategories {}

export class FindCategoriesHandler {
    constructor(private readonly categoryRepo: ICategoryRepository) {}

    execute(): Promise<Result<Category[], Error>> {
        return safeAsync(async () => {
            return this.categoryRepo.findAll();
        });
    }
}

