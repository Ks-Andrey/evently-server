import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { CategoryDTO, ICategoryReader } from '@application/readers/category';

export class FindCategoriesHandler {
    constructor(private readonly categoryReader: ICategoryReader) {}

    execute(): Promise<Result<CategoryDTO[], ApplicationException>> {
        return safeAsync(async () => {
            return this.categoryReader.findAll();
        });
    }
}
