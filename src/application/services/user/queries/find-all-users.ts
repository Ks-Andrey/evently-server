import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { IUserReader, UserListView } from '@application/readers/user';

export class FindAllUsersHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(): Promise<Result<UserListView[], ApplicationException>> {
        return safeAsync(async () => {
            return await this.userReader.findAllViews();
        });
    }
}
