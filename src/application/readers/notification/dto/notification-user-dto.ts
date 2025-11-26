import { UUID } from 'crypto';

export class NotificationUserDTO {
    private constructor(
        readonly id: UUID,
        readonly username: string,
        readonly avatarUrl?: string,
    ) {}
}
