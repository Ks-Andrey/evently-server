import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/constants/roles';

import { UserController } from '../controllers/user-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { uploadAvatar } from '../middlewares/file-upload-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { validate } from '../middlewares/validation-middleware';
import {
    getUserByIdSchema,
    getUserByNameSchema,
    getUserByEmailSchema,
    editUserSchema,
    editEmailSchema,
    editPasswordSchema,
    deleteUserSchema,
    toggleBlockUserSchema,
    subscribeToEventSchema,
    unsubscribeFromEventSchema,
    uploadAvatarSchema,
    deleteAvatarSchema,
} from '../validations';

export function createUserRoutes(userController: UserController, tokenManager: ITokenManager): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);
    const adminOnly = roleMiddleware([Roles.ADMIN]);

    // Публичные маршруты
    router.get('/:id', validate(getUserByIdSchema), (req, res) => userController.getUserById(req, res));
    router.get('/name/:username', validate(getUserByNameSchema), (req, res) => userController.getUserByName(req, res));
    router.get('/email/:email', validate(getUserByEmailSchema), (req, res) => userController.getUserByEmail(req, res));

    // Защищенные маршруты
    router.get('/', auth, adminOnly, (req, res) => userController.getAllUsers(req, res));
    router.get('/me/profile', auth, (req, res) => userController.getCurrentUser(req, res));
    router.get('/me/subscriptions', auth, (req, res) => userController.getUserSubscriptions(req, res));
    router.put('/me', auth, validate(editUserSchema), (req, res) => userController.editUser(req, res));
    router.put('/me/email', auth, validate(editEmailSchema), (req, res) => userController.editEmail(req, res));
    router.put('/me/password', auth, validate(editPasswordSchema), (req, res) => userController.editPassword(req, res));
    router.post('/me/avatar', auth, uploadAvatar, validate(uploadAvatarSchema), (req, res) =>
        userController.uploadAvatar(req, res),
    );
    router.delete('/me/avatar', auth, validate(deleteAvatarSchema), (req, res) =>
        userController.deleteAvatar(req, res),
    );
    router.post('/subscribe', auth, validate(subscribeToEventSchema), (req, res) =>
        userController.subscribeToEvent(req, res),
    );
    router.post('/unsubscribe', auth, validate(unsubscribeFromEventSchema), (req, res) =>
        userController.unsubscribeFromEvent(req, res),
    );

    // Админские маршруты
    router.delete('/:id', auth, adminOnly, validate(deleteUserSchema), (req, res) =>
        userController.deleteUser(req, res),
    );
    router.post('/:id/toggle-block', auth, adminOnly, validate(toggleBlockUserSchema), (req, res) =>
        userController.toggleBlockUser(req, res),
    );

    return router;
}
