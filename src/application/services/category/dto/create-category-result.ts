import { UUID } from 'crypto';

export class CreateCategoryResult {
    private constructor(
        readonly categoryId: UUID,
        readonly message: string,
    ) {}

    static create(categoryId: UUID): CreateCategoryResult {
        return new CreateCategoryResult(categoryId, 'Category created successfully');
    }
}
