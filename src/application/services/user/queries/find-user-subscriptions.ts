import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { IUserReader, UserEventDTO } from '@application/readers/user';

export class FindUserSubscriptions {
    constructor(readonly userId: UUID) {}
}

export class FindUserSubscriptionsHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(query: FindUserSubscriptions): Promise<Result<UserEventDTO[], ApplicationException>> {
        return safeAsync(async () => {
            return await this.userReader.findUserEvents(query.userId);
        });
    }
}
