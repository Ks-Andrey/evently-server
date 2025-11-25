import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/config/roles';

import { CommentController } from '../controllers/comment-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';

export function createCommentRoutes(commentController: CommentController, tokenManager: ITokenManager): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);
    const adminOrUser = roleMiddleware([Roles.ADMIN, Roles.USER, Roles.ORGANIZER]);

    // Публичные маршруты
    router.get('/', (req, res) => commentController.getAllComments(req, res));
    router.get('/event/:eventId', (req, res) => commentController.getCommentsByEvent(req, res));
    router.get('/user/:userId', (req, res) => commentController.getCommentsByUser(req, res));
    router.get('/:id', (req, res) => commentController.getCommentById(req, res));

    // Защищенные маршруты
    router.post('/', auth, (req, res) => commentController.createComment(req, res));
    router.put('/:id', auth, adminOrUser, (req, res) => commentController.editComment(req, res));
    router.delete('/:id', auth, adminOrUser, (req, res) => commentController.deleteComment(req, res));

    return router;
}
