import { Request } from 'express';

import { NotAuthenticatedException } from '@application/common';
import { FindUserNotifications } from '@application/services/notification';

export class NotificationMapper {
    static toFindUserNotificationsQuery(req: Request): FindUserNotifications {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        return new FindUserNotifications(req.user.userId);
    }
}
