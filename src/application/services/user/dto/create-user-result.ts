import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class CreateUserResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): CreateUserResult {
        return new CreateUserResult(userId, MESSAGES.result.user.created);
    }
}
