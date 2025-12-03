import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';

import { AuthController } from '../controllers/auth-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { authRateLimiter } from '../middlewares/rate-limit-middleware';
import { validate } from '../middlewares/validation-middleware';
import { registerSchema, loginSchema, confirmEmailSchema, refreshTokensSchema, logoutSchema } from '../validations';

export function createAuthRoutes(authController: AuthController, tokenManager: ITokenManager): Router {
    const router = Router();

    router.post('/register', authRateLimiter, validate(registerSchema), (req, res) =>
        authController.register(req, res),
    );
    router.post('/login', authRateLimiter, validate(loginSchema), (req, res) => authController.login(req, res));
    router.post('/confirm-email', validate(confirmEmailSchema), (req, res) => authController.confirmEmail(req, res));
    router.post('/refresh', validate(refreshTokensSchema), (req, res) => authController.refreshTokens(req, res));
    router.post('/logout', authMiddleware(tokenManager), validate(logoutSchema), (req, res) =>
        authController.logout(req, res),
    );

    return router;
}
