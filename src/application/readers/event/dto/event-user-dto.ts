import { UUID } from 'crypto';

export class EventUserDTO {
    private constructor(
        readonly id: UUID,
        readonly name: string,
        readonly avatarUrl?: string,
    ) {}

    static create(id: UUID, name: string, avatarUrl?: string): EventUserDTO {
        return new EventUserDTO(id, name, avatarUrl);
    }
}
