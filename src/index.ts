import express, { Express, Request, Response, NextFunction } from 'express';

import { createErrorResponse } from '@api/common';
import { createAppRoutes } from '@api/routes';
import { RouteNotFoundException } from '@application/common';

import { PORT } from '@common/config/app';
import { NODE_ENV } from '@common/config/logger';
import { log } from '@common/utils/logger';
import { getAppDependencies, createDIContainer } from '@infrastructure/di';
import { disconnectPrisma, disconnectRedis } from '@infrastructure/utils';

function setupExpressApp(controllers: ReturnType<typeof getAppDependencies>): Express {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });

    const appRoutes = createAppRoutes(
        controllers.authController,
        controllers.userController,
        controllers.eventController,
        controllers.categoryController,
        controllers.commentController,
        controllers.notificationController,
        controllers.userTypeController,
        controllers.geocoderController,
        controllers.tokenManager,
    );

    app.use('/api', appRoutes);

    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.use((req: Request, res: Response) => {
        const errorResponse = createErrorResponse(new RouteNotFoundException());
        res.status(errorResponse.status).json(errorResponse);
    });

    app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return next(err);
        }

        const errorResponse = createErrorResponse(err);
        res.status(errorResponse.status).json(errorResponse);
    });

    return app;
}

async function startServer() {
    try {
        log.info('Initializing application...');

        const container = createDIContainer();
        const controllers = getAppDependencies(container);
        log.info('Dependencies initialized');

        const app = setupExpressApp(controllers);
        log.info('Express app configured');

        const server = app.listen(PORT, () => {
            log.info(`Server is running on port ${PORT}`);
            log.info(`Environment: ${NODE_ENV || 'development'}`);
        });

        const shutdown = async (signal: string) => {
            log.info(`${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                log.info('HTTP server closed');

                await disconnectPrisma();
                await disconnectRedis();

                process.exit(0);
            });

            setTimeout(() => {
                log.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

        process.on('unhandledRejection', (reason, promise) => {
            log.error('Unhandled Rejection at:', { promise, reason });
        });

        process.on('uncaughtException', (error) => {
            log.error('Uncaught Exception:', { error });
            process.exit(1);
        });
    } catch (error) {
        log.error('Failed to start server', { error });
        process.exit(1);
    }
}

startServer();
