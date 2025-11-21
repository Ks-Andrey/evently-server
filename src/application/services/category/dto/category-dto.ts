import { UUID } from 'crypto';

export class CategoryDTO {
    private constructor(
        readonly categoryId: UUID,
        readonly categoryName: string,
    ) {}
}
