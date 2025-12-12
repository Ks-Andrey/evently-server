import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class CreateCategoryResult {
    private constructor(
        readonly categoryId: UUID,
        readonly message: string,
    ) {}

    static create(categoryId: UUID): CreateCategoryResult {
        return new CreateCategoryResult(categoryId, MESSAGES.result.category.created);
    }
}
