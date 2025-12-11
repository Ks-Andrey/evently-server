import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { UserTypeDTO, IUserTypeReader } from '@application/readers/user-type';
import { Roles } from '@common/constants/roles';

export class FindUserTypesQuery {
    constructor(readonly role?: Roles) {}
}

export class FindUserTypesHandler {
    constructor(private readonly userTypeReader: IUserTypeReader) {}

    execute(query: FindUserTypesQuery): Promise<Result<UserTypeDTO[], ApplicationException>> {
        return safeAsync(async () => {
            return this.userTypeReader.findAll(query?.role === Roles.ADMIN);
        });
    }
}
