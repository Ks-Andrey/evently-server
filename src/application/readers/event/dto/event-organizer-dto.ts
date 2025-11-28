import { UUID } from 'crypto';

export class EventOrganizerDTO {
    private constructor(
        readonly id: UUID,
        readonly username: string,
        readonly personalData?: string,
    ) {}

    static create(id: UUID, username: string, personalData?: string): EventOrganizerDTO {
        return new EventOrganizerDTO(id, username, personalData);
    }
}
