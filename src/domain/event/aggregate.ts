import { UUID } from 'crypto';

import { EventCategory } from './entities/event-category';
import { EventOrganizer } from './entities/event-organizer';
import { EventSubscriber } from './entities/event-subscriber';
import { InvalidEventDateException, UserAlreadySubscribedException, UserNotSubscribedException } from './exceptions';

export class Event {
    private subscribers: EventSubscriber[] = [];

    constructor(
        public readonly id: UUID,
        public readonly organizerId: EventOrganizer,
        public category: EventCategory,
        public title: string,
        public description: string,
        public date: Date,
        public location: string,
        subscribers?: EventSubscriber[],
    ) {
        if (subscribers) {
            this.subscribers = subscribers;
        }
    }

    updateDetails(title: string, description: string, date: Date, location: string): void {
        if (date < new Date()) throw new InvalidEventDateException();
        this.title = title;
        this.description = description;
        this.date = date;
        this.location = location;
    }

    changeCategory(newCategory: EventCategory): void {
        this.category = newCategory;
    }

    subscribe(subscriber: EventSubscriber): void {
        if (this.isSubscribed(subscriber.id)) {
            throw new UserAlreadySubscribedException();
        }
        this.subscribers.push(subscriber);
    }

    unsubscribe(subscriberId: UUID): void {
        const index = this.subscribers.findIndex((sub) => sub.id === subscriberId);
        if (index === -1) {
            throw new UserNotSubscribedException();
        }
        this.subscribers.splice(index, 1);
    }

    isSubscribed(subscriberId: UUID): boolean {
        return this.subscribers.some((sub) => sub.id === subscriberId);
    }

    getSubscribersCount(): number {
        return this.subscribers.length;
    }

    getSubscribers(): EventSubscriber[] {
        return [...this.subscribers];
    }

    canBeEditedBy(organizerId: UUID): boolean {
        return this.organizerId.id === organizerId;
    }

    shouldSendReminderNotification(): boolean {
        const now = new Date();
        const eventDate = new Date(this.date);
        const oneDayBefore = new Date(eventDate);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);

        return now >= oneDayBefore && now < eventDate && !this.isPast();
    }

    isPast(): boolean {
        return new Date(this.date) < new Date();
    }
}
