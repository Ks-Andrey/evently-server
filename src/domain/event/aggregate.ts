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
    private readonly _id: UUID;
    private readonly _organizer: EventOrganizer;
    private _category: EventCategory;
    private _title: string;
    private _description: string;
    private _date: Date;
    private _location: string;
    private _subscriberCount: number;
    private _commentCount: number;

    constructor(
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

        this._id = id;
        this._organizer = organizer;
        this._category = category;
        this._title = title.trim();
        this._description = description.trim();
        this._date = new Date(date);
        this._location = location.trim();
        this._subscriberCount = subscriberCount;
        this._commentCount = commentCount;
    }

    get id(): UUID {
        return this._id;
    }

    get organizer(): EventOrganizer {
        return this._organizer;
    }

    get organizerId(): EventOrganizer {
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

    updateDetails(title: string, description: string, date: Date, location: string): void {
        this.ensureValidTitle(title);
        this.ensureValidDescription(description);
        this.ensureValidLocation(location);
        this.ensureValidEventDate(date);

        this._title = title.trim();
        this._description = description.trim();
        this._date = new Date(date);
        this._location = location.trim();
    }

    changeCategory(newCategory: EventCategory): void {
        if (!newCategory) {
            throw new EventCategoryIsRequiredException();
        }
        this._category = newCategory;
    }

    canBeEditedBy(organizerId: UUID): boolean {
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

    private isPast(): boolean {
        return new Date(this._date) < new Date();
    }

    private ensureValidTitle(title: string): void {
        if (!title || title.trim().length === 0) {
            throw new EventTitleCannotBeEmptyException();
        }
    }

    private ensureValidDescription(description: string): void {
        if (!description || description.trim().length === 0) {
            throw new EventDescriptionCannotBeEmptyException();
        }
    }

    private ensureValidLocation(location: string): void {
        if (!location || location.trim().length === 0) {
            throw new EventLocationCannotBeEmptyException();
        }
    }

    private ensureValidEventDate(date: Date): void {
        if (!date || date < new Date()) {
            throw new InvalidEventDateException();
        }
    }
}
