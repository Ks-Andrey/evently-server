import { UUID } from 'crypto';

import { EventUser } from '../../event';
import { UserEvent } from '../../user';

export interface ISubscriptionDao {
    hasSubscribed(eventId: UUID, userId: UUID): Promise<boolean>;
    subscribe(eventId: UUID, userId: UUID): Promise<void>;
    unsubscribe(eventId: UUID, userId: UUID): Promise<void>;
    findSubscribersByEventId(eventId: string): Promise<EventUser[]>;
    findEventsByUserId(userId: string): Promise<UserEvent[]>;
}
