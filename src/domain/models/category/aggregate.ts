import { UUID } from 'crypto';

import { CategoryIdCannotBeEmptyException, CategoryNameCannotBeEmptyException } from './exceptions';

export class Category {
    private constructor(
        private readonly _categoryId: UUID,
        private _categoryName: string,
    ) {}

    static create(categoryId: UUID, categoryName: string): Category {
        if (!categoryId) {
            throw new CategoryIdCannotBeEmptyException();
        }
        Category.ensureValidName(categoryName);

        return new Category(categoryId, categoryName.trim());
    }

    get categoryId(): UUID {
        return this._categoryId;
    }

    get categoryName(): string {
        return this._categoryName;
    }

    updateName(newName: string): void {
        Category.ensureValidName(newName);
        this._categoryName = newName.trim();
    }

    private static ensureValidName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new CategoryNameCannotBeEmptyException();
        }
    }
}
