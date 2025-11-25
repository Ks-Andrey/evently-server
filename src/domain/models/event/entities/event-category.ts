import { UUID } from 'crypto';

import { CategoryIdCannotBeEmptyException, CategoryNameCannotBeEmptyException } from '../exceptions';

export class EventCategory {
    private constructor(
        private readonly _categoryId: UUID,
        private readonly _categoryName: string,
    ) {}

    static create(categoryId: UUID, categoryName: string): EventCategory {
        if (!categoryId) {
            throw new CategoryIdCannotBeEmptyException();
        }
        if (!categoryName || categoryName.trim().length === 0) {
            throw new CategoryNameCannotBeEmptyException();
        }

        return new EventCategory(categoryId, categoryName.trim());
    }

    get categoryId(): UUID {
        return this._categoryId;
    }

    get categoryName(): string {
        return this._categoryName;
    }
}
