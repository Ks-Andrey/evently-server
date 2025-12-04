import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/constants/roles';

import { StatisticsController } from '../controllers/statistics-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';

export function createStatisticsRoutes(
    statisticsController: StatisticsController,
    tokenManager: ITokenManager,
): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);
    const adminOnly = roleMiddleware([Roles.ADMIN]);

    // Админские маршруты
    router.get('/users', auth, adminOnly, (req, res) => statisticsController.getUserStatistics(req, res));
    router.get('/events', auth, adminOnly, (req, res) => statisticsController.getEventStatistics(req, res));
    router.get('/system', auth, adminOnly, (req, res) => statisticsController.getSystemStatistics(req, res));

    return router;
}
