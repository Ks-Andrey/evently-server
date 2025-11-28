import { UUID } from 'crypto';

import { Roles } from '@common/constants/roles';

export class UserTypeDTO {
    private constructor(
        readonly userTypeId: UUID,
        readonly typeName: string,
        readonly role: Roles,
    ) {}

    static create(userTypeId: UUID, typeName: string, role: Roles): UserTypeDTO {
        return new UserTypeDTO(userTypeId, typeName, role);
    }
}
