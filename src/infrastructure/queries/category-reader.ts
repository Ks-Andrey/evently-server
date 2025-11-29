import { UUID } from 'crypto';

import { ICategoryReader } from '@application/readers/category';
import { CategoryDTO } from '@application/readers/category/dto/category-dto';
import { Prisma } from '@generated/prisma/client';

import { PrismaUnitOfWork } from '../database/unit-of-work';

type CategoryData = Prisma.CategoryGetPayload<{}>;

export class CategoryReader implements ICategoryReader {
    constructor(private readonly unitOfWork: PrismaUnitOfWork) {}

    private get prisma() {
        return this.unitOfWork.getClient();
    }

    async findAll(): Promise<CategoryDTO[]> {
        const categoriesData = await this.prisma.category.findMany();

        return categoriesData.map((categoryData) => this.toCategoryDTO(categoryData));
    }

    async findById(categoryId: UUID): Promise<CategoryDTO | null> {
        const categoryData = await this.prisma.category.findUnique({
            where: { categoryId },
        });

        if (!categoryData) {
            return null;
        }

        return this.toCategoryDTO(categoryData);
    }

    async findByName(name: string): Promise<CategoryDTO | null> {
        const categoryData = await this.prisma.category.findUnique({
            where: { categoryName: name },
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
