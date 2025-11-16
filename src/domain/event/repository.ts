import { IRepository } from '@common/types/repository';
import { Event } from '@domain/event';

import { UUID } from 'crypto';

export interface IEventRepository extends IRepository<Event> {
    findAll(): Promise<Event[]>;
    findByOrganizerId(organizerId: UUID): Promise<Event[]>;
    findByCategory(categoryId: UUID): Promise<Event[]>;
    searchByKeyword(keyword: string): Promise<Event[]>;
}
