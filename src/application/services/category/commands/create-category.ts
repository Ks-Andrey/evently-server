import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { ApplicationException, safeAsync } from '@application/common';
import { ICategoryReader } from '@application/readers/category';
import { Category, ICategoryRepository } from '@domain/events/category';

import { CreateCategoryResult } from '../dto/create-category-result';
import { CategoryAlreadyExistsException } from '../exceptions';

export class CreateCategory {
    constructor(readonly name: string) {}
}

export class CreateCategoryHandler {
    constructor(
        private readonly categoryReader: ICategoryReader,
        private readonly categoryRepo: ICategoryRepository,
    ) {}

    execute(command: CreateCategory): Promise<Result<CreateCategoryResult, ApplicationException>> {
        return safeAsync(async () => {
            const existing = await this.categoryReader.findByName(command.name.trim());
            if (existing) throw new CategoryAlreadyExistsException();

            const category = Category.create(v4() as UUID, command.name);
            await this.categoryRepo.save(category);

            return CreateCategoryResult.create(category.categoryId);
        });
    }
}
