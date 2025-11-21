import { UUID } from 'crypto';

import { NotificationUserDTO } from './notification-user-dto';

export class NotificationDTO {
    private constructor(
        readonly id: UUID,
        readonly eventId: UUID,
        readonly user: NotificationUserDTO,
        readonly createdAt: Date,
        readonly message: string,
    ) {}
}
