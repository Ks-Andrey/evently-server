import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/constants/roles';

import { UserTypeController } from '../controllers/user-type-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';

export function createUserTypeRoutes(userTypeController: UserTypeController, tokenManager: ITokenManager): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);
    const adminOnly = roleMiddleware([Roles.ADMIN]);

    // Публичные маршруты
    router.get('/', (req, res) => userTypeController.getUserTypes(req, res));
    router.get('/:id', (req, res) => userTypeController.getUserTypeById(req, res));

    // Админские маршруты
    router.post('/', auth, adminOnly, (req, res) => userTypeController.createUserType(req, res));
    router.put('/:id', auth, adminOnly, (req, res) => userTypeController.editUserType(req, res));
    router.delete('/:id', auth, adminOnly, (req, res) => userTypeController.deleteUserType(req, res));

    return router;
}
