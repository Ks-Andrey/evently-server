import { UUID } from 'crypto';

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
    async findEventUsers(eventId: UUID): Promise<EventUserDTO[]> {
        const subscriptions = await prisma.eventSubscription.findMany({
            where: { eventId },
            include: {
                user: true,
            },
        });

        return subscriptions.map((sub) =>
            EventUserDTO.create(sub.user.id as UUID, sub.user.username, sub.user.imageUrl || undefined),
        );
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

    async findByOrganizer(organizerId: UUID): Promise<EventDTO[]> {
        const eventsData = await prisma.event.findMany({
            where: { organizerId },
            include: {
                organizer: true,
                category: true,
            },
        });

        return eventsData.map((eventData) => this.toEventDTO(eventData));
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

    async findWithFilters(filters: EventFilters): Promise<EventDTO[]> {
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

        const eventsData = await prisma.event.findMany({
            where,
            include: {
                organizer: true,
                category: true,
            },
        });

        return eventsData.map((eventData) => this.toEventDTO(eventData));
    }

    private toEventDTO(eventData: EventWithRelations): EventDTO {
        const organizerDTO = EventOrganizerDTO.create(
            eventData.organizer.id as UUID,
            eventData.organizer.username,
            eventData.organizer.personalData || undefined,
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
