import { UUID } from 'crypto';

import { Roles } from '@common/constants/roles';

import { UserTypeIdCannotBeEmptyException, UserTypeNameCannotBeEmptyException } from '../exceptions';

export class UserTypeData {
    private constructor(
        private readonly _userTypeId: UUID,
        private readonly _typeName: string,
        private readonly _role: Roles,
    ) {}

    static create(userTypeId: UUID, typeName: string, role: Roles): UserTypeData {
        UserTypeData.ensureValidId(userTypeId);
        UserTypeData.ensureValidName(typeName);

        return new UserTypeData(userTypeId, typeName.trim(), role);
    }

    private static ensureValidId(id: UUID): void {
        if (!id || id.trim().length === 0) {
            throw new UserTypeIdCannotBeEmptyException();
        }
    }

    private static ensureValidName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new UserTypeNameCannotBeEmptyException();
        }
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
