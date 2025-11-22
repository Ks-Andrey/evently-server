import { UUID } from 'crypto';

import { EventCategory } from './entities/event-category';
import { EventOrganizer } from './entities/event-organizer';
import {
    InvalidEventDateException,
    EventIdCannotBeEmptyException,
    EventOrganizerIsRequiredException,
    EventCategoryIsRequiredException,
    EventTitleCannotBeEmptyException,
    EventDescriptionCannotBeEmptyException,
    EventLocationCannotBeEmptyException,
    SubscriberCountCannotBeNegativeException,
    CommentCountCannotBeNegativeException,
    CannotDecrementSubscriberCountBelowZeroException,
    CannotDecrementCommentCountBelowZeroException,
} from './exceptions';

export class Event {
    private constructor(
        private readonly _id: UUID,
        private readonly _organizer: EventOrganizer,
        private _category: EventCategory,
        private _title: string,
        private _description: string,
        private _date: Date,
        private _location: string,
        private _subscriberCount: number,
        private _commentCount: number,
    ) {}

    static create(
        id: UUID,
        organizer: EventOrganizer,
        category: EventCategory,
        title: string,
        description: string,
        date: Date,
        location: string,
        subscriberCount: number = 0,
        commentCount: number = 0,
    ) {
        if (!id) {
            throw new EventIdCannotBeEmptyException();
        }
        if (!organizer) {
            throw new EventOrganizerIsRequiredException();
        }
        if (!category) {
            throw new EventCategoryIsRequiredException();
        }
        this.ensureValidTitle(title);
        this.ensureValidDescription(description);
        this.ensureValidLocation(location);
        this.ensureValidEventDate(date);
        if (subscriberCount < 0) {
            throw new SubscriberCountCannotBeNegativeException();
        }
        if (commentCount < 0) {
            throw new CommentCountCannotBeNegativeException();
        }

        return new Event(
            id,
            organizer,
            category,
            title.trim(),
            description.trim(),
            new Date(date),
            location.trim(),
            subscriberCount,
            commentCount,
        );
    }

    get id(): UUID {
        return this._id;
    }

    get organizer(): EventOrganizer {
        return this._organizer;
    }

    get category(): EventCategory {
        return this._category;
    }

    get title(): string {
        return this._title;
    }

    get description(): string {
        return this._description;
    }

    get date(): Date {
        return this._date;
    }

    get location(): string {
        return this._location;
    }

    get subscriberCount(): number {
        return this._subscriberCount;
    }

    get commentCount(): number {
        return this._commentCount;
    }

    updateDetails(title?: string, description?: string, date?: Date, location?: string): void {
        title && Event.ensureValidTitle(title);
        description && Event.ensureValidDescription(description);
        location && Event.ensureValidLocation(location);
        date && Event.ensureValidEventDate(date);

        title && (this._title = title.trim());
        description && (this._description = description.trim());
        date && (this._date = new Date(date));
        location && (this._location = location.trim());
    }

    changeCategory(newCategory: EventCategory): void {
        if (!newCategory) {
            throw new EventCategoryIsRequiredException();
        }
        this._category = newCategory;
    }

    canEditedBy(organizerId: UUID): boolean {
        return this._organizer.id === organizerId;
    }

    shouldSendReminderNotification(): boolean {
        const now = new Date();
        const eventDate = new Date(this._date);
        const oneDayBefore = new Date(eventDate);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);

        return now >= oneDayBefore && now < eventDate && !this.isPast();
    }

    incrementSubscriberCount(): void {
        this._subscriberCount += 1;
    }

    decrementSubscriberCount(): void {
        if (this._subscriberCount === 0) {
            throw new CannotDecrementSubscriberCountBelowZeroException();
        }
        this._subscriberCount -= 1;
    }

    incrementCommentCount(): void {
        this._commentCount += 1;
    }

    decrementCommentCount(): void {
        if (this._commentCount === 0) {
            throw new CannotDecrementCommentCountBelowZeroException();
        }
        this._commentCount -= 1;
    }

    hasStarted(referenceDate: Date = new Date()): boolean {
        return new Date(this._date) <= referenceDate;
    }

    private isPast(): boolean {
        return new Date(this._date) < new Date();
    }

    private static ensureValidTitle(title: string): void {
        if (!title || title.trim().length === 0) {
            throw new EventTitleCannotBeEmptyException();
        }
    }

    private static ensureValidDescription(description: string): void {
        if (!description || description.trim().length === 0) {
            throw new EventDescriptionCannotBeEmptyException();
        }
    }

    private static ensureValidLocation(location: string): void {
        if (!location || location.trim().length === 0) {
            throw new EventLocationCannotBeEmptyException();
        }
    }

    private static ensureValidEventDate(date: Date): void {
        if (!date || date < new Date()) {
            throw new InvalidEventDateException();
        }
    }
}
