import { Router } from 'express';

import { AuthController } from '../controllers/auth-controller';
import { authRateLimiter } from '../middlewares/rate-limit-middleware';
import { validate } from '../middlewares/validation-middleware';
import { registerSchema, loginSchema, confirmEmailSchema } from '../validations';

export function createAuthRoutes(authController: AuthController): Router {
    const router = Router();

    router.post('/register', authRateLimiter, validate(registerSchema), (req, res) =>
        authController.register(req, res),
    );
    router.post('/login', authRateLimiter, validate(loginSchema), (req, res) => authController.login(req, res));
    router.post('/confirm-email', validate(confirmEmailSchema), (req, res) => authController.confirmEmail(req, res));

    return router;
}
