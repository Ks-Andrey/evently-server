import { IRepository } from '@common/types/repository';
import { Notification } from '@domain/models/notification';

export interface INotificationRepository extends IRepository<Notification> {}
