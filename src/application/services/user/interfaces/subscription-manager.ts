import { UUID } from 'crypto';

export interface ISubscriptionManager {
    hasSubscribed(eventId: UUID, userId: UUID): Promise<boolean>;
    subscribe(eventId: UUID, userId: UUID): Promise<void>;
    unsubscribe(eventId: UUID, userId: UUID): Promise<void>;
}
