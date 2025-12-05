import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/constants/roles';

import { CommentController } from '../controllers/comment-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { validate } from '../middlewares/validation-middleware';
import {
    getAllCommentsSchema,
    getCommentByIdSchema,
    getCommentsByEventSchema,
    getCommentsByUserSchema,
    createCommentSchema,
    editCommentSchema,
    deleteCommentSchema,
} from '../validations';

export function createCommentRoutes(commentController: CommentController, tokenManager: ITokenManager): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);
    const adminOrUser = roleMiddleware([Roles.ADMIN, Roles.USER]);

    // Публичные маршруты
    router.get('/', validate(getAllCommentsSchema), (req, res) => commentController.getAllComments(req, res));
    router.get('/event/:eventId', validate(getCommentsByEventSchema), (req, res) =>
        commentController.getCommentsByEvent(req, res),
    );
    router.get('/user/:userId', validate(getCommentsByUserSchema), (req, res) =>
        commentController.getCommentsByUser(req, res),
    );
    router.get('/:id', validate(getCommentByIdSchema), (req, res) => commentController.getCommentById(req, res));

    // Защищенные маршруты
    router.post('/', auth, validate(createCommentSchema), (req, res) => commentController.createComment(req, res));
    router.put('/:id', auth, adminOrUser, validate(editCommentSchema), (req, res) =>
        commentController.editComment(req, res),
    );
    router.delete('/:id', auth, adminOrUser, validate(deleteCommentSchema), (req, res) =>
        commentController.deleteComment(req, res),
    );

    return router;
}
