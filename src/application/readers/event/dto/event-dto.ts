import { UUID } from 'crypto';

import { EventCategoryDTO } from './event-category-dto';
import { EventOrganizerDTO } from './event-organizer-dto';

export class EventDTO {
    private constructor(
        readonly id: UUID,
        readonly organizer: EventOrganizerDTO,
        readonly category: EventCategoryDTO,
        readonly title: string,
        readonly description: string,
        readonly date: Date,
        readonly location: string,
        readonly subscriberCount: number,
        readonly commentCount: number,
    ) {}

    static create(
        id: UUID,
        organizer: EventOrganizerDTO,
        category: EventCategoryDTO,
        title: string,
        description: string,
        date: Date,
        location: string,
        subscriberCount: number,
        commentCount: number,
    ): EventDTO {
        return new EventDTO(id, organizer, category, title, description, date, location, subscriberCount, commentCount);
    }
}
