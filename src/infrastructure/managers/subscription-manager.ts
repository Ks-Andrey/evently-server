import { UUID } from 'crypto';

import { ISubscriptionManager } from '@application/services/user/interfaces/subscription-manager';
import { PrismaClient } from '@generated/prisma/client';

import { PrismaUnitOfWork } from '../database/unit-of-work';

export class SubscriptionManager implements ISubscriptionManager {
    constructor(private readonly unitOfWork: PrismaUnitOfWork) {}

    private get prisma(): PrismaClient {
        return this.unitOfWork.getClient() as PrismaClient;
    }

    async hasSubscribed(eventId: UUID, userId: UUID): Promise<boolean> {
        const subscription = await this.prisma.eventSubscription.findUnique({
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
        await this.prisma.eventSubscription.create({
            data: {
                eventId,
                userId,
            },
        });
    }

    async unsubscribe(eventId: UUID, userId: UUID): Promise<void> {
        await this.prisma.eventSubscription.delete({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
        });
    }
}
