import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, PaginationParams, PaginationResult, safeAsync } from '@application/common';
import { NotificationDTO, INotificationReader } from '@application/readers/notification';

export class FindUserNotifications {
    constructor(
        readonly userId: UUID,
        readonly pagination: PaginationParams,
        readonly dateFrom?: string,
        readonly dateTo?: string,
    ) {}
}

export class FindUserNotificationsHandler {
    constructor(private readonly notificationReader: INotificationReader) {}

    execute(query: FindUserNotifications): Promise<Result<PaginationResult<NotificationDTO>, ApplicationException>> {
        return safeAsync(async () => {
            const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
            const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
            return await this.notificationReader.findByUserId(query.userId, query.pagination, dateFrom, dateTo);
        });
    }
}
