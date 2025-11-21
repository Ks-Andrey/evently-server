import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';
import { UserEventDTO } from '../dto/user-event-dto';
import { IUserReader } from '../interfaces/user-reader';

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
