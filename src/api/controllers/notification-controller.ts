import { Request, Response } from 'express';

import { FindUserNotificationsHandler } from '@application/services/notification';

import { handleResult } from '../common/utils/error-handler';
import { NotificationMapper } from '../mappers';

export class NotificationController {
    constructor(private readonly findUserNotificationsHandler: FindUserNotificationsHandler) {}

    async getUserNotifications(req: Request, res: Response): Promise<void> {
        const query = NotificationMapper.toFindUserNotificationsQuery(req);
        const result = await this.findUserNotificationsHandler.execute(query);
        handleResult(result, res);
    }
}
