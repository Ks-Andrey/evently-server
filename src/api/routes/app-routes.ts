import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';

import {
    createAuthRoutes,
    createUserRoutes,
    createEventRoutes,
    createCategoryRoutes,
    createCommentRoutes,
    createNotificationRoutes,
    createUserTypeRoutes,
    createGeocoderRoutes,
    createStatisticsRoutes,
} from './index';
import {
    AuthController,
    UserController,
    EventController,
    CategoryController,
    CommentController,
    NotificationController,
    UserTypeController,
    GeocoderController,
    StatisticsController,
} from '../controllers';
import { loggerMiddleware } from '../middlewares/logger-middleware';

export function createAppRoutes(
    authController: AuthController,
    userController: UserController,
    eventController: EventController,
    categoryController: CategoryController,
    commentController: CommentController,
    notificationController: NotificationController,
    userTypeController: UserTypeController,
    geocoderController: GeocoderController,
    statisticsController: StatisticsController,
    tokenManager: ITokenManager,
): Router {
    const router = Router();

    router.use(loggerMiddleware);

    router.use('/auth', createAuthRoutes(authController, tokenManager));
    router.use('/users', createUserRoutes(userController, tokenManager));
    router.use('/events', createEventRoutes(eventController, tokenManager));
    router.use('/categories', createCategoryRoutes(categoryController, tokenManager));
    router.use('/comments', createCommentRoutes(commentController, tokenManager));
    router.use('/notifications', createNotificationRoutes(notificationController, tokenManager));
    router.use('/user-types', createUserTypeRoutes(userTypeController, tokenManager));
    router.use('/geocoder', createGeocoderRoutes(geocoderController));
    router.use('/statistics', createStatisticsRoutes(statisticsController, tokenManager));

    return router;
}
