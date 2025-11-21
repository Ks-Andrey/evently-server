import { Result } from 'true-myth';

import { safeAsync } from '../../common';
import { CategoryDTO } from '../dto/category-dto';
import { ICategoryReader } from '../interfaces/category-reader';

export class FindCategories {}

export class FindCategoriesHandler {
    constructor(private readonly categoryReader: ICategoryReader) {}

    execute(): Promise<Result<CategoryDTO[], Error>> {
        return safeAsync(async () => {
            return this.categoryReader.findAll();
        });
    }
}
