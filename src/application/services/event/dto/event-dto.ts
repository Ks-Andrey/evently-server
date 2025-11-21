import { UUID } from 'crypto';

import { EventCategoryDTO } from './event-category-dto';
import { EventOrganizerDTO } from './event-organizer-dto';

export class EventDTO {
    constructor(
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
}
