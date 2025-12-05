import { Request } from 'express';

import { NotAuthenticatedException } from '@application/common';
import { FindUserNotifications } from '@application/services/notification';

import { parsePaginationParams } from '../common/utils/pagination';

export class NotificationMapper {
    static toFindUserNotificationsQuery(req: Request): FindUserNotifications {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const pagination = parsePaginationParams(req);
        const { dateFrom, dateTo } = req.query;
        return new FindUserNotifications(req.user.userId, pagination, dateFrom as string, dateTo as string);
    }
}
