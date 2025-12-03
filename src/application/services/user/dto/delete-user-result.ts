import { UUID } from 'crypto';

export class DeleteUserResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): DeleteUserResult {
        return new DeleteUserResult(userId, 'User deleted successfully');
    }
}
