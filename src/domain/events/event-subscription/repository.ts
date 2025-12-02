import { UUID } from 'crypto';

export interface IEventSubscriptionRepository {
    isUserSubscribedToEvent(userId: UUID, eventId: UUID): Promise<boolean>;
    createSubscription(userId: UUID, eventId: UUID): Promise<void>;
    removeSubscription(userId: UUID, eventId: UUID): Promise<void>;
}
