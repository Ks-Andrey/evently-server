import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { UserDTO, IUserReader } from '@application/readers/user';

export class FindAllUsersHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(): Promise<Result<UserDTO[], Error>> {
        return safeAsync(async () => {
            return await this.userReader.findAll();
        });
    }
}
