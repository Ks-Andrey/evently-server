import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class DeleteUserResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): DeleteUserResult {
        return new DeleteUserResult(userId, MESSAGES.result.user.deleted);
    }
}
