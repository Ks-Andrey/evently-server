import { IRepository } from '@common/types/repository';
import { Notification } from '@domain/social/notification';

export interface INotificationRepository extends IRepository<Notification> {}
