import { UUID } from 'crypto';

import { EventDTO } from '../dto/event-dto';
import { EventUserDTO } from '../dto/event-user-dto';

export interface IEventReader {
    findEventUsers(eventId: UUID): Promise<EventUserDTO[]>;
    findAll(): Promise<EventDTO[]>;
    findByOrganizer(organizerId: UUID): Promise<EventDTO[]>;
    findByCategory(categoryId: UUID): Promise<EventDTO[]>;
}
