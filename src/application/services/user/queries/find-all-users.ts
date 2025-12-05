import { Result } from 'true-myth';

import { ApplicationException, PaginationParams, PaginationResult, safeAsync } from '@application/common';
import { IUserReader, UserListView } from '@application/readers/user';

export class FindAllUsers {
    constructor(
        readonly pagination: PaginationParams,
        readonly search?: string,
    ) {}
}

export class FindAllUsersHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(query: FindAllUsers): Promise<Result<PaginationResult<UserListView>, ApplicationException>> {
        return safeAsync(async () => {
            return await this.userReader.findAllViews(query.pagination, query.search);
        });
    }
}
