import { UUID } from 'crypto';

export class EventUserDTO {
    private constructor(
        readonly id: UUID,
        readonly subscriberName: string,
        readonly avatarUrl?: string,
    ) {}
}
