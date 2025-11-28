import { UUID } from 'crypto';

export class EventUserDTO {
    private constructor(
        readonly id: UUID,
        readonly subscriberName: string,
        readonly avatarUrl?: string,
    ) {}

    static create(id: UUID, subscriberName: string, avatarUrl?: string): EventUserDTO {
        return new EventUserDTO(id, subscriberName, avatarUrl);
    }
}
