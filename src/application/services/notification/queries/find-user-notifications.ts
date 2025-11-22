import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { NotificationDTO, INotificationReader } from '@application/queries/notification';
import { safeAsync } from '@application/services/common';

export class FindUserNotifications {
    constructor(readonly userId: UUID) {}
}

export class FindUserNotificationsHandler {
    constructor(private readonly notificationReader: INotificationReader) {}

    execute(query: FindUserNotifications): Promise<Result<NotificationDTO[], Error>> {
        return safeAsync(async () => {
            return await this.notificationReader.findByUserId(query.userId);
        });
    }
}
