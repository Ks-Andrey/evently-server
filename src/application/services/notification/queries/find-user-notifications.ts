import { NotFoundException } from '@domain/common';
import { INotificationRepository, Notification } from '@domain/notification';
import { IUserRepository } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class FindUserNotifications {
    constructor(readonly userId: UUID) {}
}

export class FindUserNotificationsHandler {
    constructor(
        private readonly notificationRepo: INotificationRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    execute(query: FindUserNotifications): Promise<Result<Notification[], Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(query.userId);
            if (!user) throw new NotFoundException();

            return this.notificationRepo.findByUserId(user.id);
        });
    }
}
