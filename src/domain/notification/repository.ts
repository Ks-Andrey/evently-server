import { IRepository } from '@common/types/repository';
import { Notification } from '@domain/notification';

export interface INotificationRepository extends IRepository<Notification> {}
