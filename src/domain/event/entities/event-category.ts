import { UUID } from 'crypto';

import { CategoryNameCannotBeEmptyException } from '../exceptions';

export class EventCategory {
    constructor(
        public readonly categoryId: UUID,
        public categoryName: string,
    ) {
        if (!categoryName || categoryName.trim().length === 0) {
            throw new CategoryNameCannotBeEmptyException();
        }
    }

    updateName(newName: string): void {
        if (!newName || newName.trim().length === 0) {
            throw new CategoryNameCannotBeEmptyException();
        }
        this.categoryName = newName;
    }
}
