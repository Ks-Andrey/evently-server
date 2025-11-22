import { UUID } from 'crypto';

export class EventCategoryDTO {
    private constructor(
        readonly categoryId: UUID,
        readonly categoryName: string,
    ) {}
}
