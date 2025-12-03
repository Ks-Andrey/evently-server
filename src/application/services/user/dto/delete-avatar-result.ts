import { UUID } from 'crypto';

export class DeleteAvatarResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): DeleteAvatarResult {
        return new DeleteAvatarResult(userId, 'Avatar deleted successfully');
    }
}
