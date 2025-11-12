import { UUID } from 'crypto';

import { CategoryIdCannotBeEmptyException, CategoryNameCannotBeEmptyException } from '../exceptions';

export class EventCategory {
    private readonly _categoryId: UUID;
    private _categoryName: string;

    constructor(categoryId: UUID, categoryName: string) {
        if (!categoryId) {
            throw new CategoryIdCannotBeEmptyException();
        }
        this.ensureValidName(categoryName);

        this._categoryId = categoryId;
        this._categoryName = categoryName.trim();
    }

    get categoryId(): UUID {
        return this._categoryId;
    }

    get categoryName(): string {
        return this._categoryName;
    }

    updateName(newName: string): void {
        this.ensureValidName(newName);
        this._categoryName = newName.trim();
    }

    private ensureValidName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new CategoryNameCannotBeEmptyException();
        }
    }
}
