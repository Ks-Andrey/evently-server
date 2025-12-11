import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { ICategoryRepository } from '@domain/events/category';

import { DeleteCategoryResult } from '../dto/delete-category-result';
import { CategoryNotFoundException } from '../exceptions';

export class DeleteCategory {
    constructor(readonly categoryId: UUID) {}
}

export class DeleteCategoryHandler {
    constructor(private readonly categoryRepo: ICategoryRepository) {}

    execute(command: DeleteCategory): Promise<Result<DeleteCategoryResult, ApplicationException>> {
        return safeAsync(async () => {
            const category = await this.categoryRepo.findById(command.categoryId);
            if (!category) throw new CategoryNotFoundException();

            // При удалении категории автоматически удаляются все связанные события
            // и их зависимые данные (комментарии, подписки, уведомления, изображения)
            // благодаря каскадному удалению в схеме Prisma
            await this.categoryRepo.delete(category.categoryId);

            return DeleteCategoryResult.create(category.categoryId);
        });
    }
}
