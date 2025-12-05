import { UUID } from 'crypto';

import { Roles } from '@common/constants/roles';

export class UserTypeDTO {
    constructor(
        readonly id: UUID,
        readonly name: string,
        readonly role: Roles,
    ) {}

    static create(id: UUID, name: string, role: Roles): UserTypeDTO {
        return new UserTypeDTO(id, name, role);
    }
}
