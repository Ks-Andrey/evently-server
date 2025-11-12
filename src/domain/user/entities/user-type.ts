import { UserTypeIdCannotBeEmptyException, UserTypeNameCannotBeEmptyException } from '../exceptions';

export class UserType {
    private readonly _userTypeId: string;
    private readonly _typeName: string;

    constructor(userTypeId: string, typeName: string) {
        if (!userTypeId || userTypeId.trim().length === 0) {
            throw new UserTypeIdCannotBeEmptyException();
        }
        if (!typeName || typeName.trim().length === 0) {
            throw new UserTypeNameCannotBeEmptyException();
        }

        this._userTypeId = userTypeId;
        this._typeName = typeName.trim();
    }

    get userTypeId(): string {
        return this._userTypeId;
    }

    get typeName(): string {
        return this._typeName;
    }
}
