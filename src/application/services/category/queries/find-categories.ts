import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { CategoryDTO, ICategoryReader } from '@application/readers/category';

export class FindCategories {}

export class FindCategoriesHandler {
    constructor(private readonly categoryReader: ICategoryReader) {}

    execute(): Promise<Result<CategoryDTO[], Error>> {
        return safeAsync(async () => {
            return this.categoryReader.findAll();
        });
    }
}
