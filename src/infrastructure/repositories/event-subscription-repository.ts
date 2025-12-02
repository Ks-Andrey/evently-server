import { UUID } from 'crypto';

import { IEventSubscriptionRepository } from '@domain/events/event-subscription';

import { prisma } from '../utils';

export class EventSubscriptionRepository implements IEventSubscriptionRepository {
    async isUserSubscribedToEvent(userId: UUID, eventId: UUID): Promise<boolean> {
        const subscription = await prisma.eventSubscription.findUnique({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
        });

        return subscription !== null;
    }

    async createSubscription(userId: UUID, eventId: UUID): Promise<void> {
        await prisma.eventSubscription.create({
            data: {
                eventId,
                userId,
            },
        });
    }

    async removeSubscription(userId: UUID, eventId: UUID): Promise<void> {
        await prisma.eventSubscription.delete({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
        });
    }
}
