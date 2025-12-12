import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class DeleteCategoryResult {
    private constructor(
        readonly categoryId: UUID,
        readonly message: string,
    ) {}

    static create(categoryId: UUID): DeleteCategoryResult {
        return new DeleteCategoryResult(categoryId, MESSAGES.result.category.deleted);
    }
}
