import { UUID } from 'crypto';

export class EventCategoryDTO {
    private constructor(
        readonly categoryId: UUID,
        readonly categoryName: string,
    ) {}

    static create(categoryId: UUID, categoryName: string): EventCategoryDTO {
        return new EventCategoryDTO(categoryId, categoryName);
    }
}
