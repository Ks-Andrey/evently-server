import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { ApplicationException, safeAsync } from '@application/common';
import { ICategoryReader } from '@application/readers/category';
import { Category, ICategoryRepository } from '@domain/models/category';

import { CategoryAlreadyExistsException } from '../exceptions';

export class CreateCategory {
    constructor(readonly name: string) {}
}

export class CreateCategoryHandler {
    constructor(
        private readonly categoryReader: ICategoryReader,
        private readonly categoryRepo: ICategoryRepository,
    ) {}

    execute(command: CreateCategory): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            const existing = await this.categoryReader.findByName(command.name.trim());
            if (existing) throw new CategoryAlreadyExistsException();

            const category = Category.create(v4() as UUID, command.name);
            await this.categoryRepo.save(category);

            return category.categoryId;
        });
    }
}
