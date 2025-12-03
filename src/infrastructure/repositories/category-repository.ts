import { UUID } from 'crypto';

import { IUnitOfWork } from '@common/types/unit-of-work';
import { ICategoryRepository, Category } from '@domain/events/category';
import { Prisma } from '@prisma/client';

type CategoryData = Prisma.CategoryGetPayload<{}>;

export class CategoryRepository implements ICategoryRepository {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    async findById(id: UUID): Promise<Category | null> {
        const client = this.unitOfWork.getClient();
        const categoryData = await client.category.findUnique({
            where: { categoryId: id },
        });

        if (!categoryData) {
            return null;
        }

        return this.toDomain(categoryData);
    }

    async save(entity: Category): Promise<void> {
        const client = this.unitOfWork.getClient();
        const categoryData = {
            categoryId: entity.categoryId,
            categoryName: entity.categoryName,
        };

        await client.category.upsert({
            where: { categoryId: entity.categoryId },
            create: categoryData,
            update: categoryData,
        });
    }

    async delete(id: UUID): Promise<void> {
        const client = this.unitOfWork.getClient();
        await client.category.delete({
            where: { categoryId: id },
        });
    }

    private toDomain(categoryData: CategoryData): Category {
        return Category.create(categoryData.categoryId as UUID, categoryData.categoryName);
    }
}
