import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';

import { NotificationController } from '../controllers/notification-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { validate } from '../middlewares/validation-middleware';
import { getUserNotificationsSchema } from '../validations';

export function createNotificationRoutes(
    notificationController: NotificationController,
    tokenManager: ITokenManager,
): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);

    // Защищенные маршруты
    router.get('/me', auth, validate(getUserNotificationsSchema), (req, res) =>
        notificationController.getUserNotifications(req, res),
    );

    return router;
}
