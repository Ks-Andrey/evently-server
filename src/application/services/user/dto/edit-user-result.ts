import { UUID } from 'crypto';

export class EditUserResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): EditUserResult {
        return new EditUserResult(userId, 'User updated successfully');
    }
}
