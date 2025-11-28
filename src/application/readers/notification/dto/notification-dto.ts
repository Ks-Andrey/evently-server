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

    static create(
        id: UUID,
        eventId: UUID,
        user: NotificationUserDTO,
        createdAt: Date,
        message: string,
    ): NotificationDTO {
        return new NotificationDTO(id, eventId, user, createdAt, message);
    }
}
