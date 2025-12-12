import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class EditCategoryResult {
    private constructor(
        readonly categoryId: UUID,
        readonly message: string,
    ) {}

    static create(categoryId: UUID): EditCategoryResult {
        return new EditCategoryResult(categoryId, MESSAGES.result.category.updated);
    }
}
