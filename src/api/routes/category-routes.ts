import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/constants/roles';

import { CategoryController } from '../controllers/category-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { validate } from '../middlewares/validation-middleware';
import { getCategoryByIdSchema, createCategorySchema, editCategorySchema, deleteCategorySchema } from '../validations';

export function createCategoryRoutes(categoryController: CategoryController, tokenManager: ITokenManager): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);
    const adminOnly = roleMiddleware([Roles.ADMIN]);

    // Публичные маршруты
    router.get('/', (req, res) => categoryController.getCategories(req, res));
    router.get('/:id', validate(getCategoryByIdSchema), (req, res) => categoryController.getCategoryById(req, res));

    // Админские маршруты
    router.post('/', auth, adminOnly, validate(createCategorySchema), (req, res) =>
        categoryController.createCategory(req, res),
    );
    router.put('/:id', auth, adminOnly, validate(editCategorySchema), (req, res) =>
        categoryController.editCategory(req, res),
    );
    router.delete('/:id', auth, adminOnly, validate(deleteCategorySchema), (req, res) =>
        categoryController.deleteCategory(req, res),
    );

    return router;
}
