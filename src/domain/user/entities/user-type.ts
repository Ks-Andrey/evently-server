import { UUID } from 'crypto';

import { UserTypeIdCannotBeEmptyException, UserTypeNameCannotBeEmptyException } from '../exceptions';

export class UserType {
    private constructor(
        private readonly _userTypeId: UUID,
        private readonly _typeName: string,
    ) {}

    static create(userTypeId: UUID, typeName: string) {
        if (!userTypeId || userTypeId.trim().length === 0) {
            throw new UserTypeIdCannotBeEmptyException();
        }
        if (!typeName || typeName.trim().length === 0) {
            throw new UserTypeNameCannotBeEmptyException();
        }

        return new UserType(userTypeId, typeName.trim());
    }

    get userTypeId(): UUID {
        return this._userTypeId;
    }

    get typeName(): string {
        return this._typeName;
    }
}
