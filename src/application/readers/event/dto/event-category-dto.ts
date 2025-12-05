import { UUID } from 'crypto';

export class EventCategoryDTO {
    private constructor(
        readonly id: UUID,
        readonly name: string,
    ) {}

    static create(id: UUID, name: string): EventCategoryDTO {
        return new EventCategoryDTO(id, name);
    }
}
