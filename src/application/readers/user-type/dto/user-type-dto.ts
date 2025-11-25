import { UUID } from 'crypto';

import { Roles } from '@common/config/roles';

export class UserTypeDTO {
    constructor(
        readonly userTypeId: UUID,
        readonly typeName: string,
        readonly role: Roles,
    ) {}
}
