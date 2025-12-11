import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/constants/roles';

import { UserTypeController } from '../controllers/user-type-controller';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { validate } from '../middlewares/validation-middleware';
import { getUserTypeByIdSchema, createUserTypeSchema, editUserTypeSchema, deleteUserTypeSchema } from '../validations';

export function createUserTypeRoutes(userTypeController: UserTypeController, tokenManager: ITokenManager): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);
    const optionalAuth = optionalAuthMiddleware(tokenManager);
    const adminOnly = roleMiddleware([Roles.ADMIN]);

    // Публичные маршруты (с опциональной аутентификацией для передачи userId)
    router.get('/', optionalAuth, (req, res) => userTypeController.getUserTypes(req, res));
    router.get('/:id', validate(getUserTypeByIdSchema), (req, res) => userTypeController.getUserTypeById(req, res));

    // Админские маршруты
    router.post('/', auth, adminOnly, validate(createUserTypeSchema), (req, res) =>
        userTypeController.createUserType(req, res),
    );
    router.put('/:id', auth, adminOnly, validate(editUserTypeSchema), (req, res) =>
        userTypeController.editUserType(req, res),
    );
    router.delete('/:id', auth, adminOnly, validate(deleteUserTypeSchema), (req, res) =>
        userTypeController.deleteUserType(req, res),
    );

    return router;
}
