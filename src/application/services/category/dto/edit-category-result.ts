import { UUID } from 'crypto';

export class EditCategoryResult {
    private constructor(
        readonly categoryId: UUID,
        readonly message: string,
    ) {}

    static create(categoryId: UUID): EditCategoryResult {
        return new EditCategoryResult(categoryId, 'Category updated successfully');
    }
}
