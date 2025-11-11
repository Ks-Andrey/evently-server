import { UUID } from 'crypto';

export class EventOrganizer {
    constructor(
        public readonly id: UUID,
        public readonly username: string,
        public readonly personalData: string,
    ) {}
}
