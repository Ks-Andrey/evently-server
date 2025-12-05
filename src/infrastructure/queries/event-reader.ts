import { UUID } from 'crypto';

import { PaginationParams, PaginationResult, createPaginationResult } from '@application/common';
import {
    IEventReader,
    EventFilters,
    EventDTO,
    EventCategoryDTO,
    EventOrganizerDTO,
    EventUserDTO,
    EventLocationDTO,
} from '@application/readers/event';
import { Prisma } from '@prisma/client';

import { prisma } from '../utils';

type EventWithRelations = Prisma.EventGetPayload<{
    include: {
        organizer: true;
        category: true;
    };
}>;

export class EventReader implements IEventReader {
    async findEventUsers(
        eventId: UUID,
        pagination?: PaginationParams,
        search?: string,
    ): Promise<PaginationResult<EventUserDTO>> {
        const page = pagination?.page ?? 1;
        const pageSize = pagination?.pageSize ?? 10;
        const skip = (page - 1) * pageSize;

        const where: Prisma.EventSubscriptionWhereInput = {
            eventId,
            ...(search && {
                user: {
                    username: { contains: search, mode: 'insensitive' },
                },
            }),
        };

        const [subscriptions, total] = await Promise.all([
            prisma.eventSubscription.findMany({
                where,
                include: {
                    user: true,
                },
                skip,
                take: pageSize,
            }),
            prisma.eventSubscription.count({ where }),
        ]);

        const data = subscriptions.map((sub) =>
            EventUserDTO.create(sub.user.id as UUID, sub.user.username, sub.user.imageUrl ?? undefined),
        );

        return createPaginationResult(data, total, page, pageSize);
    }

    async findById(eventId: UUID): Promise<EventDTO | null> {
        const eventData = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                organizer: true,
                category: true,
            },
        });

        if (!eventData) {
            return null;
        }

        return this.toEventDTO(eventData);
    }

    async findAll(): Promise<EventDTO[]> {
        const eventsData = await prisma.event.findMany({
            include: {
                organizer: true,
                category: true,
            },
        });

        return eventsData.map((eventData) => this.toEventDTO(eventData));
    }

    async findByOrganizer(
        organizerId: UUID,
        pagination?: PaginationParams,
        dateFrom?: Date,
        dateTo?: Date,
        keyword?: string,
    ): Promise<PaginationResult<EventDTO>> {
        const page = pagination?.page ?? 1;
        const pageSize = pagination?.pageSize ?? 10;
        const skip = (page - 1) * pageSize;

        const where: Prisma.EventWhereInput = {
            organizerId,
            ...(dateFrom || dateTo
                ? {
                      date: {
                          ...(dateFrom ? { gte: dateFrom } : {}),
                          ...(dateTo ? { lte: dateTo } : {}),
                      },
                  }
                : {}),
            ...(keyword
                ? {
                      OR: [
                          { title: { contains: keyword, mode: 'insensitive' } },
                          { description: { contains: keyword, mode: 'insensitive' } },
                          { location: { contains: keyword, mode: 'insensitive' } },
                      ],
                  }
                : {}),
        };

        const [eventsData, total] = await Promise.all([
            prisma.event.findMany({
                where,
                include: {
                    organizer: true,
                    category: true,
                },
                skip,
                take: pageSize,
                orderBy: { date: 'asc' },
            }),
            prisma.event.count({ where }),
        ]);

        const data = eventsData.map((eventData) => this.toEventDTO(eventData));

        return createPaginationResult(data, total, page, pageSize);
    }

    async findByCategory(categoryId: UUID): Promise<EventDTO[]> {
        const eventsData = await prisma.event.findMany({
            where: { categoryId },
            include: {
                organizer: true,
                category: true,
            },
        });

        return eventsData.map((eventData) => this.toEventDTO(eventData));
    }

    async findWithFilters(filters: EventFilters, pagination: PaginationParams): Promise<PaginationResult<EventDTO>> {
        const page = pagination.page;
        const pageSize = pagination.pageSize;
        const skip = (page - 1) * pageSize;

        interface PrismaWhereClause {
            categoryId?: string;
            date?: {
                gte?: Date;
                lte?: Date;
            };
            OR?: Array<{
                title?: { contains: string; mode: 'insensitive' };
                description?: { contains: string; mode: 'insensitive' };
                location?: { contains: string; mode: 'insensitive' };
            }>;
        }
        const where: PrismaWhereClause = {};

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters.dateFrom || filters.dateTo) {
            where.date = {};
            if (filters.dateFrom) {
                where.date.gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                where.date.lte = filters.dateTo;
            }
        }

        if (filters.keyword) {
            where.OR = [
                { title: { contains: filters.keyword, mode: 'insensitive' } },
                { description: { contains: filters.keyword, mode: 'insensitive' } },
                { location: { contains: filters.keyword, mode: 'insensitive' } },
            ];
        }

        const [eventsData, total] = await Promise.all([
            prisma.event.findMany({
                where,
                include: {
                    organizer: true,
                    category: true,
                },
                skip,
                take: pageSize,
                orderBy: { date: 'asc' },
            }),
            prisma.event.count({ where }),
        ]);

        const data = eventsData.map((eventData) => this.toEventDTO(eventData));

        return createPaginationResult(data, total, page, pageSize);
    }

    private toEventDTO(eventData: EventWithRelations): EventDTO {
        const organizerDTO = EventOrganizerDTO.create(
            eventData.organizer.id as UUID,
            eventData.organizer.username,
            eventData.organizer.personalData ?? undefined,
        );

        const categoryDTO = EventCategoryDTO.create(
            eventData.category.categoryId as UUID,
            eventData.category.categoryName,
        );

        const locationDTO = EventLocationDTO.create(eventData.location, eventData.latitude, eventData.longitude);

        return EventDTO.create(
            eventData.id as UUID,
            organizerDTO,
            categoryDTO,
            eventData.title,
            eventData.description,
            eventData.date,
            locationDTO,
            eventData.subscriberCount,
            eventData.commentCount,
        );
    }
}
