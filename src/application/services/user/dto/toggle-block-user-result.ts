import { UUID } from 'crypto';

export class ToggleBlockUserResult {
    private constructor(
        readonly userId: UUID,
        readonly isBlocked: boolean,
        readonly message: string,
    ) {}

    static create(userId: UUID, isBlocked: boolean): ToggleBlockUserResult {
        const message = isBlocked ? 'User blocked successfully' : 'User unblocked successfully';
        return new ToggleBlockUserResult(userId, isBlocked, message);
    }
}
