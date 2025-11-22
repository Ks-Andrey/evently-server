import { UUID } from 'crypto';

export class EventOrganizerDTO {
    private constructor(
        readonly id: UUID,
        readonly username: string,
        readonly personalData?: string,
    ) {}
}
