import { UUID } from 'crypto';

import { CategoryIdCannotBeEmptyException, CategoryNameCannotBeEmptyException } from '../exceptions';

export class EventCategory {
    private constructor(
        private readonly _categoryId: UUID,
        private _categoryName: string,
    ) {}

    static create(categoryId: UUID, categoryName: string) {
        if (!categoryId) {
            throw new CategoryIdCannotBeEmptyException();
        }
        this.ensureValidName(categoryName);

        return new EventCategory(categoryId, categoryName.trim());
    }

    get categoryId(): UUID {
        return this._categoryId;
    }

    get categoryName(): string {
        return this._categoryName;
    }

    updateName(newName: string): void {
        EventCategory.ensureValidName(newName);
        this._categoryName = newName.trim();
    }

    private static ensureValidName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new CategoryNameCannotBeEmptyException();
        }
    }
}
