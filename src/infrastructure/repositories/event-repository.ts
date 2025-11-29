import { UUID, randomUUID } from 'crypto';

import { IEventRepository } from '@domain/models/event';
import { Event } from '@domain/models/event';
import { EventCategory } from '@domain/models/event/entities/event-category';
import { EventOrganizer } from '@domain/models/event/entities/event-organizer';
import { Prisma, PrismaClient } from '@generated/prisma/client';

import { PrismaUnitOfWork } from '../database/unit-of-work';

type EventWithRelations = Prisma.EventGetPayload<{
    include: {
        organizer: true;
        category: true;
        images: true;
    };
}>;

type PrismaTransactionClient = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export class EventRepository implements IEventRepository {
    constructor(private readonly unitOfWork: PrismaUnitOfWork) {}

    private get prisma() {
        return this.unitOfWork.getClient();
    }

    async findById(id: UUID): Promise<Event | null> {
        const eventData = await this.prisma.event.findUnique({
            where: { id },
            include: {
                organizer: true,
                category: true,
                images: true,
            },
        });

        if (!eventData) {
            return null;
        }

        return this.toDomain(eventData);
    }

    async save(entity: Event): Promise<void> {
        const organizer = entity.organizer;
        const category = entity.category;
        const imageUrls = entity.imageUrls;

        const eventData = {
            id: entity.id,
            organizerId: organizer.id,
            categoryId: category.categoryId,
            title: entity.title,
            description: entity.description,
            date: entity.date,
            location: entity.location,
            subscriberCount: entity.subscriberCount,
            commentCount: entity.commentCount,
        };

        const mainClient = this.unitOfWork.getMainClient();
        await mainClient.$transaction(async (tx: PrismaTransactionClient) => {
            await tx.event.upsert({
                where: { id: entity.id },
                create: eventData,
                update: eventData,
            });

            await tx.eventImage.deleteMany({
                where: { eventId: entity.id },
            });

            if (imageUrls.length > 0) {
                await tx.eventImage.createMany({
                    data: imageUrls.map((url: string) => ({
                        id: randomUUID(),
                        eventId: entity.id,
                        imageUrl: url,
                    })),
                });
            }
        });
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.event.delete({
            where: { id },
        });
    }

    private toDomain(eventData: EventWithRelations): Event {
        const organizer = EventOrganizer.create(
            eventData.organizer.id as UUID,
            eventData.organizer.username,
            eventData.organizer.personalData || undefined,
        );
        const category = EventCategory.create(eventData.category.categoryId as UUID, eventData.category.categoryName);

        return Event.create(
            eventData.id as UUID,
            organizer,
            category,
            eventData.title,
            eventData.description,
            eventData.date,
            eventData.location,
        );
    }
}
