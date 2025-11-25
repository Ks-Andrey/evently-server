import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { UserTypeDTO, IUserTypeReader } from '@application/readers/user-type';

export class FindUserTypesHandler {
    constructor(private readonly userTypeReader: IUserTypeReader) {}

    execute(): Promise<Result<UserTypeDTO[], ApplicationException>> {
        return safeAsync(async () => {
            return this.userTypeReader.findAll();
        });
    }
}
