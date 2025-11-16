import { IRepository } from '@common/types/repository';
import { Notification } from '@domain/notification';

import { UUID } from 'crypto';

export interface INotificationRepository extends IRepository<Notification> {
    findUnsent(): Promise<Notification[]>;
    findByUserId(userId: UUID): Promise<Notification[]>;
    markAsSent(id: UUID): Promise<void>;
}
