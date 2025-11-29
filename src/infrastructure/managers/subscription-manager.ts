import { UUID } from 'crypto';

import { ISubscriptionManager } from '@application/services/user/interfaces/subscription-manager';

import { prisma } from '../database/prisma-client';

export class SubscriptionManager implements ISubscriptionManager {
    async hasSubscribed(eventId: UUID, userId: UUID): Promise<boolean> {
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

    async subscribe(eventId: UUID, userId: UUID): Promise<void> {
        await prisma.eventSubscription.create({
            data: {
                eventId,
                userId,
            },
        });
    }

    async unsubscribe(eventId: UUID, userId: UUID): Promise<void> {
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
