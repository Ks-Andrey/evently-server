import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, PaginationParams, PaginationResult, safeAsync } from '@application/common';
import { IUserReader, UserEventDTO } from '@application/readers/user';

export class FindUserSubscriptions {
    constructor(
        readonly userId: UUID,
        readonly pagination?: PaginationParams,
        readonly search?: string,
    ) {}
}

export class FindUserSubscriptionsHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(query: FindUserSubscriptions): Promise<Result<PaginationResult<UserEventDTO>, ApplicationException>> {
        return safeAsync(async () => {
            return await this.userReader.findUserEvents(query.userId, query.pagination, query.search);
        });
    }
}
