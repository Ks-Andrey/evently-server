import { IRepository } from '@common/types/repository';
import { Notification } from '@domain/identity/notification';

export interface INotificationRepository extends IRepository<Notification> {}
