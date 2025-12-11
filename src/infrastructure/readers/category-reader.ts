import { UUID } from 'crypto';

import { ICategoryReader, CategoryDTO } from '@application/readers/category';
import { Prisma } from '@prisma/client';

import { prisma } from '../utils';

type CategoryData = Prisma.CategoryGetPayload<{}>;

export class CategoryReader implements ICategoryReader {
    async findAll(): Promise<CategoryDTO[]> {
        const categoriesData = await prisma.category.findMany();

        return categoriesData.map((categoryData) => this.toCategoryDTO(categoryData));
    }

    async findById(categoryId: UUID): Promise<CategoryDTO | null> {
        const categoryData = await prisma.category.findUnique({
            where: { categoryId },
        });

        if (!categoryData) {
            return null;
        }

        return this.toCategoryDTO(categoryData);
    }

    async findByName(name: string): Promise<CategoryDTO | null> {
        const normalizedName = name.trim();
        const categoryData = await prisma.category.findFirst({
            where: { categoryName: { equals: normalizedName, mode: 'insensitive' } },
        });

        if (!categoryData) {
            return null;
        }

        return this.toCategoryDTO(categoryData);
    }

    private toCategoryDTO(categoryData: CategoryData): CategoryDTO {
        return CategoryDTO.create(categoryData.categoryId as UUID, categoryData.categoryName);
    }
}
