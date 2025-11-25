import { UUID } from 'crypto';

import { NotificationDTO } from './dto/notification-dto';

export interface INotificationReader {
    findByUserId(userId: UUID): Promise<NotificationDTO[]>;
}
