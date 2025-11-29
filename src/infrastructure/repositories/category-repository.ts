import { UUID } from 'crypto';

import { ICategoryRepository } from '@domain/models/category';
import { Category } from '@domain/models/category';
import { Prisma } from '@generated/prisma/client';

import { prisma } from '../database/prisma-client';

type CategoryData = Prisma.CategoryGetPayload<{}>;

export class CategoryRepository implements ICategoryRepository {
    async findById(id: UUID): Promise<Category | null> {
        const categoryData = await prisma.category.findUnique({
            where: { categoryId: id },
        });

        if (!categoryData) {
            return null;
        }

        return this.toDomain(categoryData);
    }

    async save(entity: Category): Promise<void> {
        const categoryData = {
            categoryId: entity.categoryId,
            categoryName: entity.categoryName,
        };

        await prisma.category.upsert({
            where: { categoryId: entity.categoryId },
            create: categoryData,
            update: categoryData,
        });
    }

    async delete(id: UUID): Promise<void> {
        await prisma.category.delete({
            where: { categoryId: id },
        });
    }

    private toDomain(categoryData: CategoryData): Category {
        return Category.create(categoryData.categoryId as UUID, categoryData.categoryName);
    }
}
