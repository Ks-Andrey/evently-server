import { IRepository } from '@common/types/repository';
import { Event } from '@domain/models/event';

export interface IEventRepository extends IRepository<Event> {}
