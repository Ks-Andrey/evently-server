import { UUID } from 'crypto';

import { GALLERY_MAX_PHOTOS } from '@common/constants/file-upload';

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
    EventAlreadyStartedException,
    GalleryUrlCannotBeEmptyException,
    GalleryMaxPhotosExceededException,
    GalleryPhotoNotFoundException,
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
        private _imageNames: string[],
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
        Event.ensureValidTitle(title);
        Event.ensureValidDescription(description);
        Event.ensureValidLocation(location);
        Event.ensureValidEventDate(date);
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
            [],
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

    get imageNames(): readonly string[] {
        return [...this._imageNames];
    }

    updateDetails(title?: string, description?: string, date?: Date, location?: string): void {
        if (title !== undefined) {
            Event.ensureValidTitle(title);
            this._title = title.trim();
        }

        if (description !== undefined) {
            Event.ensureValidDescription(description);
            this._description = description.trim();
        }

        if (location !== undefined) {
            Event.ensureValidLocation(location);
            this._location = location.trim();
        }

        if (date !== undefined) {
            Event.ensureValidEventDate(date);
            this._date = date;
        }
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

    shouldSendReminderNotification(referenceDate: Date = new Date()): boolean {
        const eventDate = new Date(this._date);
        const oneDayBefore = new Date(eventDate);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);

        return referenceDate >= oneDayBefore && referenceDate < eventDate && !this.isPast();
    }

    incrementSubscriberCount(): void {
        if (this.hasStarted()) throw new EventAlreadyStartedException();
        this._subscriberCount += 1;
    }

    decrementSubscriberCount(): void {
        if (this._subscriberCount === 0) {
            throw new CannotDecrementSubscriberCountBelowZeroException();
        }
        if (this.hasStarted()) throw new EventAlreadyStartedException();
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

    private isPast(referenceDate: Date = new Date()): boolean {
        return new Date(this._date) < referenceDate;
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

    private static ensureValidEventDate(date: Date, referenceDate: Date = new Date()): void {
        if (!date || date < referenceDate) {
            throw new InvalidEventDateException();
        }
    }

    addPhotos(imageNames: string[]): void {
        if (!Array.isArray(imageNames) || imageNames.length === 0) {
            throw new GalleryUrlCannotBeEmptyException();
        }

        const trimmedUrls = imageNames.map((name) => name.trim()).filter((name) => name.length > 0);

        if (trimmedUrls.length === 0) {
            throw new GalleryUrlCannotBeEmptyException();
        }

        if (this._imageNames.length + trimmedUrls.length > GALLERY_MAX_PHOTOS) {
            throw new GalleryMaxPhotosExceededException();
        }

        this._imageNames.push(...trimmedUrls);
    }

    addPhoto(imageName: string): void {
        if (!imageName || imageName.trim().length === 0) {
            throw new GalleryUrlCannotBeEmptyException();
        }
        if (this._imageNames.length >= GALLERY_MAX_PHOTOS) {
            throw new GalleryMaxPhotosExceededException();
        }
        this._imageNames.push(imageName.trim());
    }

    removePhoto(imageName: string): void {
        const index = this._imageNames.findIndex((name) => name === imageName);
        if (index === -1) {
            throw new GalleryPhotoNotFoundException();
        }
        this._imageNames.splice(index, 1);
    }
}
