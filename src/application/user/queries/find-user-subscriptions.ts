import { ISubscriptionDao, NotFoundError } from '@domain/common';
import { UserEvent, IUserRepository } from '@domain/user';

import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class FindUserSubscriptions {
    constructor(readonly userId: UUID) {}
}

export class FindUserSubscriptionsHandler {
    constructor(
        readonly userRepo: IUserRepository,
        readonly subscriptionDao: ISubscriptionDao,
    ) {}

    async execute(query: FindUserSubscriptions): Promise<Result<UserEvent[], Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(query.userId);
            if (!user) throw new NotFoundError();

            return await this.subscriptionDao.findEventsByUserId(query.userId);
        });
    }
}
