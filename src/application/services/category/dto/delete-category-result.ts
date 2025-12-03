import { UUID } from 'crypto';

export class DeleteCategoryResult {
    private constructor(
        readonly categoryId: UUID,
        readonly message: string,
    ) {}

    static create(categoryId: UUID): DeleteCategoryResult {
        return new DeleteCategoryResult(categoryId, 'Category deleted successfully');
    }
}
