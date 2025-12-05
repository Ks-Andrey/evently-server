import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { CategoryDTO, ICategoryReader } from '@application/readers/category';

import { CategoryNotFoundException } from '../exceptions';

export class FindCategoryById {
    constructor(readonly categoryId: UUID) {}
}

export class FindCategoryByIdHandler {
    constructor(private readonly categoryReader: ICategoryReader) {}

    execute(query: FindCategoryById): Promise<Result<CategoryDTO, ApplicationException>> {
        return safeAsync(async () => {
            const category = await this.categoryReader.findById(query.categoryId);
            if (!category) throw new CategoryNotFoundException();

            return category;
        });
    }
}
