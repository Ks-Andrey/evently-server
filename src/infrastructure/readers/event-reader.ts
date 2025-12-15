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
import { UPLOAD_DIRECTORIES } from '@common/constants/file-upload';
import { getImageUrl } from '@common/utils/image-url';
import { Prisma } from '@prisma/client';

import { prisma } from '../utils';

type EventWithRelations = Prisma.EventGetPayload<{
    include: {
        organizer: true;
        category: true;
        images: true;
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
            EventUserDTO.create(
                sub.user.id as UUID,
                sub.user.username,
                sub.user.imageUrl ? getImageUrl(sub.user.imageUrl, UPLOAD_DIRECTORIES.AVATARS) : undefined,
            ),
        );

        return createPaginationResult(data, total, page, pageSize);
    }

    async findById(eventId: UUID, userId?: UUID): Promise<EventDTO | null> {
        const eventData = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                organizer: true,
                category: true,
                images: true,
            },
        });

        if (!eventData) {
            return null;
        }

        const isSubscribed = userId ? await this.checkSubscription(eventId, userId) : false;

        return this.toEventDTO(eventData, isSubscribed);
    }

    async findByOrganizer(
        filters: EventFilters,
        pagination: PaginationParams,
        organizerId: UUID,
        userId?: UUID,
    ): Promise<PaginationResult<EventDTO>> {
        const page = pagination.page;
        const pageSize = pagination.pageSize;
        const skip = (page - 1) * pageSize;

        const now = new Date();

        interface PrismaWhereClause {
            organizerId: string;
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

        const minDate = filters.dateFrom && filters.dateFrom > now ? filters.dateFrom : now;

        const where: PrismaWhereClause = {
            organizerId,
            date: {
                gte: minDate,
            },
        };

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters.dateTo) {
            where.date = {
                ...where.date,
                lte: filters.dateTo,
            };
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
                    images: true,
                },
                skip,
                take: pageSize,
                orderBy: { date: 'asc' },
            }),
            prisma.event.count({ where }),
        ]);

        const subscriptionMap = userId
            ? await this.getSubscriptionMap(
                  userId,
                  eventsData.map((e) => e.id as UUID),
              )
            : new Map<string, boolean>();

        const data = eventsData.map((eventData) =>
            this.toEventDTO(eventData, subscriptionMap.get(eventData.id) ?? false),
        );

        return createPaginationResult(data, total, page, pageSize);
    }

    async findByCategory(categoryId: UUID, userId?: UUID): Promise<EventDTO[]> {
        const eventsData = await prisma.event.findMany({
            where: { categoryId },
            include: {
                organizer: true,
                category: true,
                images: true,
            },
        });

        const subscriptionMap = userId
            ? await this.getSubscriptionMap(
                  userId,
                  eventsData.map((e) => e.id as UUID),
              )
            : new Map<string, boolean>();

        return eventsData.map((eventData) => this.toEventDTO(eventData, subscriptionMap.get(eventData.id) ?? false));
    }

    async findAll(
        filters: EventFilters,
        pagination: PaginationParams,
        userId?: UUID,
    ): Promise<PaginationResult<EventDTO>> {
        const page = pagination.page;
        const pageSize = pagination.pageSize;
        const skip = (page - 1) * pageSize;

        const now = new Date();

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

        // Определяем минимальную дату: максимум между текущей датой и dateFrom
        const minDate = filters.dateFrom && filters.dateFrom > now ? filters.dateFrom : now;

        const where: PrismaWhereClause = {
            date: {
                gte: minDate, // Только предстоящие события
            },
        };

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters.dateTo) {
            where.date = {
                ...where.date,
                lte: filters.dateTo,
            };
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
                    images: true,
                },
                skip,
                take: pageSize,
                orderBy: { date: 'asc' },
            }),
            prisma.event.count({ where }),
        ]);

        const subscriptionMap = userId
            ? await this.getSubscriptionMap(
                  userId,
                  eventsData.map((e) => e.id as UUID),
              )
            : new Map<string, boolean>();

        const data = eventsData.map((eventData) =>
            this.toEventDTO(eventData, subscriptionMap.get(eventData.id) ?? false),
        );

        return createPaginationResult(data, total, page, pageSize);
    }

    private async getSubscriptionMap(userId: UUID, eventIds: UUID[]): Promise<Map<string, boolean>> {
        if (eventIds.length === 0) {
            return new Map<string, boolean>();
        }

        const subscriptions = await prisma.eventSubscription.findMany({
            where: {
                userId,
                eventId: { in: eventIds },
            },
            select: {
                eventId: true,
            },
        });

        const subscriptionMap = new Map<string, boolean>();
        for (const eventId of eventIds) {
            subscriptionMap.set(
                eventId,
                subscriptions.some((sub) => sub.eventId === eventId),
            );
        }

        return subscriptionMap;
    }

    private async checkSubscription(eventId: UUID, userId: UUID): Promise<boolean> {
        const subscription = await prisma.eventSubscription.findUnique({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
        });

        return !!subscription;
    }

    private toEventDTO(eventData: EventWithRelations, isSubscribed: boolean): EventDTO {
        const organizerDTO = EventOrganizerDTO.create(
            eventData.organizer.id as UUID,
            eventData.organizer.username,
            eventData.organizer.personalData ?? undefined,
            eventData.organizer.imageUrl
                ? getImageUrl(eventData.organizer.imageUrl, UPLOAD_DIRECTORIES.AVATARS)
                : undefined,
        );

        const categoryDTO = EventCategoryDTO.create(
            eventData.category.categoryId as UUID,
            eventData.category.categoryName,
        );

        const locationDTO = EventLocationDTO.create(eventData.location, eventData.latitude, eventData.longitude);
        const imagesUrls = eventData.images.map((image) => getImageUrl(image.imageUrl, UPLOAD_DIRECTORIES.EVENTS));

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
            imagesUrls,
            isSubscribed,
        );
    }
}
