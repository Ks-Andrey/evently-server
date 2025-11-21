import { UUID } from 'crypto';

export class UserEventDTO {
    constructor(
        readonly id: UUID,
        readonly eventName: string,
        readonly subscriptionsCount: number,
    ) {}
}
