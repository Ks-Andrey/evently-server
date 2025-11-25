import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { UserTypeDTO, IUserTypeReader } from '@application/readers/user-type';

export class FindUserTypes {}

export class FindUserTypesHandler {
    constructor(private readonly userTypeReader: IUserTypeReader) {}

    execute(): Promise<Result<UserTypeDTO[], Error>> {
        return safeAsync(async () => {
            return this.userTypeReader.findAll();
        });
    }
}
