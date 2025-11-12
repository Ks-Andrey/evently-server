import { Notification } from '@domain/notification';

import { IRepository } from 'src/common/types/repository';

import { UUID } from 'crypto';

export interface INotificationRepository extends IRepository<Notification> {
    findUnsent(): Promise<Notification[]>;
    findByUserId(userId: UUID): Promise<Notification[]>;
    markAsSent(id: UUID): Promise<void>;
}
