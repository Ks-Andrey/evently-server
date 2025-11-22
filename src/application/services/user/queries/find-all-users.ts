import { Result } from 'true-myth';

import { UserDTO, IUserReader } from '@application/queries/user';
import { safeAsync } from '@application/services/common';

export class FindAllUsersHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(): Promise<Result<UserDTO[], Error>> {
        return safeAsync(async () => {
            return await this.userReader.findAll();
        });
    }
}
