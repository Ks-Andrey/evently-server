import { UUID, randomUUID } from 'crypto';

import { IUnitOfWork } from '@common/types/unit-of-work';
import { EventCategory, EventOrganizer, Event, EventLocation, IEventRepository } from '@domain/events/event';
import { Prisma } from '@generated/prisma/client';

type EventWithRelations = Prisma.EventGetPayload<{
    include: {
        organizer: true;
        category: true;
        images: true;
    };
}>;

export class EventRepository implements IEventRepository {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    async findById(id: UUID): Promise<Event | null> {
        const client = this.unitOfWork.getClient();
        const eventData = await client.event.findUnique({
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
        const client = this.unitOfWork.getClient();
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
            location: entity.location.location,
            latitude: entity.location.latitude,
            longitude: entity.location.longitude,
            subscriberCount: entity.subscriberCount,
            commentCount: entity.commentCount,
        };

        // Use client from UoW - no nested transaction!
        await client.event.upsert({
            where: { id: entity.id },
            create: eventData,
            update: eventData,
        });

        await client.eventImage.deleteMany({
            where: { eventId: entity.id },
        });

        if (imageUrls.length > 0) {
            await client.eventImage.createMany({
                data: imageUrls.map((url: string) => ({
                    id: randomUUID(),
                    eventId: entity.id,
                    imageUrl: url,
                })),
            });
        }
    }

    async delete(id: UUID): Promise<void> {
        const client = this.unitOfWork.getClient();
        await client.event.delete({
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
        const location = EventLocation.create(eventData.location, eventData.longitude, eventData.latitude);

        return Event.create(
            eventData.id as UUID,
            organizer,
            category,
            eventData.title,
            eventData.description,
            eventData.date,
            location,
        );
    }
}
