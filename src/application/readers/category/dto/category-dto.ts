import { UUID } from 'crypto';

export class CategoryDTO {
    private constructor(
        readonly categoryId: UUID,
        readonly categoryName: string,
    ) {}

    static create(categoryId: UUID, categoryName: string): CategoryDTO {
        return new CategoryDTO(categoryId, categoryName);
    }
}
