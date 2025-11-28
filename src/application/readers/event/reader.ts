import { UUID } from 'crypto';

import { EventDTO } from './dto/event-dto';
import { EventUserDTO } from './dto/event-user-dto';

export interface EventFilters {
    categoryId?: UUID;
    dateFrom?: Date;
    dateTo?: Date;
    keyword?: string;
}

export interface IEventReader {
    findEventUsers(eventId: UUID): Promise<EventUserDTO[]>;
    findById(eventId: UUID): Promise<EventDTO | null>;
    findAll(): Promise<EventDTO[]>;
    findByOrganizer(organizerId: UUID): Promise<EventDTO[]>;
    findByCategory(categoryId: UUID): Promise<EventDTO[]>;
    findWithFilters(filters: EventFilters): Promise<EventDTO[]>;
}
