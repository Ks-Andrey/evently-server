import { IRepository } from '@common/types/repository';
import { Event } from '@domain/event';

export interface IEventRepository extends IRepository<Event> {}
