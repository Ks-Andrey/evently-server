import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/constants/roles';

import { UserController } from '../controllers/user-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { fileUploadMiddleware, processImageFile } from '../middlewares/file-upload-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';

export function createUserRoutes(userController: UserController, tokenManager: ITokenManager): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);
    const adminOnly = roleMiddleware([Roles.ADMIN]);

    // Публичные маршруты
    router.get('/:id', (req, res) => userController.getUserById(req, res));
    router.get('/name/:username', (req, res) => userController.getUserByName(req, res));
    router.get('/email/:email', (req, res) => userController.getUserByEmail(req, res));

    // Защищенные маршруты
    router.get('/', auth, adminOnly, (req, res) => userController.getAllUsers(req, res));
    router.get('/me/profile', auth, (req, res) => userController.getCurrentUser(req, res));
    router.get('/me/subscriptions', auth, (req, res) => userController.getUserSubscriptions(req, res));
    router.put('/me', auth, (req, res) => userController.editUser(req, res));
    router.put('/me/email', auth, (req, res) => userController.editEmail(req, res));
    router.put('/me/password', auth, (req, res) => userController.editPassword(req, res));
    router.post('/subscribe', auth, (req, res) => userController.subscribeToEvent(req, res));
    router.post('/unsubscribe', auth, (req, res) => userController.unsubscribeFromEvent(req, res));
    router.post('/me/avatar', auth, fileUploadMiddleware('avatar'), processImageFile, (req, res) =>
        userController.uploadAvatar(req, res),
    );
    router.delete('/me/avatar', auth, (req, res) => userController.deleteAvatar(req, res));

    // Админские маршруты
    router.delete('/:id', auth, adminOnly, (req, res) => userController.deleteUser(req, res));
    router.post('/:id/toggle-block', auth, adminOnly, (req, res) => userController.toggleBlockUser(req, res));

    return router;
}
