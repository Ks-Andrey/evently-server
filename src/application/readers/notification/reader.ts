import { UUID } from 'crypto';

import { PaginationParams, PaginationResult } from '@application/common';

import { NotificationDTO } from './dto/notification-dto';

export interface INotificationReader {
    findByUserId(
        userId: UUID,
        pagination: PaginationParams,
        dateFrom?: Date,
        dateTo?: Date,
    ): Promise<PaginationResult<NotificationDTO>>;
}
