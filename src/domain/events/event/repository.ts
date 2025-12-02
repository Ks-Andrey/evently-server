import { IRepository } from '@common/types/repository';
import { Event } from '@domain/events/event';

export interface IEventRepository extends IRepository<Event> {}
