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
} from './index';
import {
    AuthController,
    UserController,
    EventController,
    CategoryController,
    CommentController,
    NotificationController,
    UserTypeController,
} from '../controllers';

export function createAppRoutes(
    authController: AuthController,
    userController: UserController,
    eventController: EventController,
    categoryController: CategoryController,
    commentController: CommentController,
    notificationController: NotificationController,
    userTypeController: UserTypeController,
    tokenManager: ITokenManager,
): Router {
    const router = Router();

    router.use('/auth', createAuthRoutes(authController));
    router.use('/users', createUserRoutes(userController, tokenManager));
    router.use('/events', createEventRoutes(eventController, tokenManager));
    router.use('/categories', createCategoryRoutes(categoryController, tokenManager));
    router.use('/comments', createCommentRoutes(commentController, tokenManager));
    router.use('/notifications', createNotificationRoutes(notificationController, tokenManager));
    router.use('/user-types', createUserTypeRoutes(userTypeController, tokenManager));

    return router;
}
