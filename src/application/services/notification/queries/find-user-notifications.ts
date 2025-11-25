import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { NotificationDTO, INotificationReader } from '@application/readers/notification';

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
