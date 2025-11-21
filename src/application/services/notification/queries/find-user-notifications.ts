import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';
import { NotificationDTO } from '../dto/notification-dto';
import { INotificationReader } from '../interfaces/notification-reader';

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
