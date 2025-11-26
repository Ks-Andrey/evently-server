import { UUID } from 'crypto';

import { Roles } from '@common/constants/roles';

export class UserTypeDTO {
    constructor(
        readonly userTypeId: UUID,
        readonly typeName: string,
        readonly role: Roles,
    ) {}
}
