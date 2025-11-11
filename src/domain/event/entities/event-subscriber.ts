import { UUID } from 'crypto';

export class EventSubscriber {
    constructor(
        public readonly id: UUID,
        public readonly username: string,
    ) {}
}
