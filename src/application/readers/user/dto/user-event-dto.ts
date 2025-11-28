import { UUID } from 'crypto';

export class UserEventDTO {
    private constructor(
        readonly id: UUID,
        readonly eventName: string,
        readonly subscriptionsCount: number,
    ) {}

    static create(id: UUID, eventName: string, subscriptionsCount: number): UserEventDTO {
        return new UserEventDTO(id, eventName, subscriptionsCount);
    }
}
