import { UUID } from 'crypto';

export class CategoryDTO {
    private constructor(
        readonly id: UUID,
        readonly name: string,
    ) {}

    static create(id: UUID, name: string): CategoryDTO {
        return new CategoryDTO(id, name);
    }
}
