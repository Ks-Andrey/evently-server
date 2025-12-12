import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class CreateUserTypeResult {
    private constructor(
        readonly userTypeId: UUID,
        readonly message: string,
    ) {}

    static create(userTypeId: UUID): CreateUserTypeResult {
        return new CreateUserTypeResult(userTypeId, MESSAGES.result.userType.created);
    }
}
