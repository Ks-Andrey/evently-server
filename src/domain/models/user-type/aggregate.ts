import { UUID } from 'crypto';

import { Roles } from '@common/config/roles';

import { UserTypeIdCannotBeEmptyException, UserTypeNameCannotBeEmptyException } from './exceptions';

export class UserType {
    private constructor(
        private readonly _userTypeId: UUID,
        private _typeName: string,
        private _role: Roles,
    ) {}

    static create(userTypeId: UUID, typeName: string, role: Roles = Roles.USER): UserType {
        UserType.ensureValidId(userTypeId);
        UserType.ensureValidName(typeName);

        return new UserType(userTypeId, typeName.trim(), role);
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

    updateName(newName: string): void {
        UserType.ensureValidName(newName);
        this._typeName = newName.trim();
    }

    updateRole(newRole: Roles): void {
        this._role = newRole;
    }
}
