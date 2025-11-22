import { Result } from 'true-myth';

import { CategoryDTO, ICategoryReader } from '@application/queries/category';
import { safeAsync } from '@application/services/common';

export class FindCategories {}

export class FindCategoriesHandler {
    constructor(private readonly categoryReader: ICategoryReader) {}

    execute(): Promise<Result<CategoryDTO[], Error>> {
        return safeAsync(async () => {
            return this.categoryReader.findAll();
        });
    }
}
