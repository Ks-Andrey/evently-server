import { UUID } from 'crypto';

import { IUnitOfWork } from '@common/types/unit-of-work';
import { IEventSubscriptionRepository } from '@domain/events/event-subscription';

export class EventSubscriptionRepository implements IEventSubscriptionRepository {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    async isUserSubscribedToEvent(userId: UUID, eventId: UUID): Promise<boolean> {
        const client = this.unitOfWork.getClient();
        const subscription = await client.eventSubscription.findUnique({
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
        const client = this.unitOfWork.getClient();
        await client.eventSubscription.create({
            data: {
                eventId,
                userId,
            },
        });
    }

    async removeSubscription(userId: UUID, eventId: UUID): Promise<void> {
        const client = this.unitOfWork.getClient();
        await client.eventSubscription.delete({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
        });
    }
}
