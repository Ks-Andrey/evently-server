import { UUID } from 'crypto';

export class EditUserPasswordResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): EditUserPasswordResult {
        return new EditUserPasswordResult(userId, 'Password updated successfully');
    }
}
