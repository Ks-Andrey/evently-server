import { UUID } from 'crypto';

import { PaginationParams, PaginationResult } from '@application/common';

import { EventDTO } from './dto/event-dto';
import { EventUserDTO } from './dto/event-user-dto';

export interface EventFilters {
    categoryId?: UUID;
    dateFrom?: Date;
    dateTo?: Date;
    keyword?: string;
}

export interface IEventReader {
    findEventUsers(
        eventId: UUID,
        pagination?: PaginationParams,
        search?: string,
    ): Promise<PaginationResult<EventUserDTO>>;
    findById(eventId: UUID): Promise<EventDTO | null>;
    findAll(): Promise<EventDTO[]>;
    findByOrganizer(
        organizerId: UUID,
        pagination?: PaginationParams,
        dateFrom?: Date,
        dateTo?: Date,
        keyword?: string,
    ): Promise<PaginationResult<EventDTO>>;
    findByCategory(categoryId: UUID): Promise<EventDTO[]>;
    findWithFilters(filters: EventFilters, pagination: PaginationParams): Promise<PaginationResult<EventDTO>>;
}
