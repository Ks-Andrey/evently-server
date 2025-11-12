import { Event } from '@domain/event';

import { IRepository } from 'src/common/types/repository';

import { UUID } from 'crypto';

export interface IEventRepository extends IRepository<Event> {
    findByOrganizerId(organizerId: UUID): Promise<Event[]>;
    findUpcoming(): Promise<Event[]>;
    findByCategory(categoryId: UUID): Promise<Event[]>;
    searchByKeyword(keyword: string): Promise<Event[]>;
}
