import { UUID } from 'crypto';

export class NotificationUserDTO {
    private constructor(
        readonly id: UUID,
        readonly username: string,
        readonly avatarUrl?: string,
    ) {}

    static create(id: UUID, username: string, avatarUrl?: string): NotificationUserDTO {
        return new NotificationUserDTO(id, username, avatarUrl);
    }
}
