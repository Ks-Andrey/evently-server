import { Request, Response } from 'express';

import { FindUserNotifications, FindUserNotificationsHandler } from '@application/services/notification';

import { handleResult } from '../utils/error-handler';

export class NotificationController {
    constructor(private readonly findUserNotificationsHandler: FindUserNotificationsHandler) {}

    async getUserNotifications(req: Request, res: Response): Promise<void> {
        const query = new FindUserNotifications(req.user!.userId);
        const result = await this.findUserNotificationsHandler.execute(query);
        handleResult(result, res);
    }
}
