import { UUID } from 'crypto';

import { Roles } from '@common/constants/roles';

import { UserTypeIdCannotBeEmptyException, UserTypeNameCannotBeEmptyException } from '../exceptions';

export class UserType {
    private constructor(
        private readonly _userTypeId: UUID,
        private readonly _typeName: string,
        private readonly _role: Roles,
    ) {}

    static create(userTypeId: UUID, typeName: string, role: Roles = Roles.USER) {
        if (!userTypeId || userTypeId.trim().length === 0) {
            throw new UserTypeIdCannotBeEmptyException();
        }
        if (!typeName || typeName.trim().length === 0) {
            throw new UserTypeNameCannotBeEmptyException();
        }

        return new UserType(userTypeId, typeName.trim(), role);
    }

    get userTypeId(): UUID {
        return this._userTypeId;
    }

    get typeName(): string {
        return this._typeName;
    }

    get role(): Roles {
        return this._role;
    }
}
