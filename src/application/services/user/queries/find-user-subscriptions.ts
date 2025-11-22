import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { IUserReader, UserEventDTO } from '@application/queries/user';
import { safeAsync } from '@application/services/common';

export class FindUserSubscriptions {
    constructor(readonly userId: UUID) {}
}

export class FindUserSubscriptionsHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(query: FindUserSubscriptions): Promise<Result<UserEventDTO[], Error>> {
        return safeAsync(async () => {
            return await this.userReader.findUserEvents(query.userId);
        });
    }
}
