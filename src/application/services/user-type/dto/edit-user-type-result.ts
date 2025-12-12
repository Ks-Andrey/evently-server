import { UUID } from 'crypto';

import { MESSAGES } from '@common/constants/messages';

export class EditUserTypeResult {
    private constructor(
        readonly userTypeId: UUID,
        readonly message: string,
    ) {}

    static create(userTypeId: UUID): EditUserTypeResult {
        return new EditUserTypeResult(userTypeId, MESSAGES.result.userType.updated);
    }
}
