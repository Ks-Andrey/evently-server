import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { UserDTO, IUserReader } from '@application/readers/user';

export class FindAllUsersHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(): Promise<Result<UserDTO[], ApplicationException>> {
        return safeAsync(async () => {
            return await this.userReader.findAll();
        });
    }
}
