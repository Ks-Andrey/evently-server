import { UUID } from 'crypto';

import { ICategoryRepository } from '@domain/models/category';
import { Category } from '@domain/models/category';
import { Prisma } from '@generated/prisma/client';

import { PrismaUnitOfWork } from '../database/unit-of-work';

type CategoryData = Prisma.CategoryGetPayload<{}>;

export class CategoryRepository implements ICategoryRepository {
    constructor(private readonly unitOfWork: PrismaUnitOfWork) {}

    private get prisma() {
        return this.unitOfWork.getClient();
    }

    async findById(id: UUID): Promise<Category | null> {
        const categoryData = await this.prisma.category.findUnique({
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

        await this.prisma.category.upsert({
            where: { categoryId: entity.categoryId },
            create: categoryData,
            update: categoryData,
        });
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.category.delete({
            where: { categoryId: id },
        });
    }

    private toDomain(categoryData: CategoryData): Category {
        return Category.create(categoryData.categoryId as UUID, categoryData.categoryName);
    }
}
