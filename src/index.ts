import cookieParser from 'cookie-parser';
import express, { Express, Request, Response } from 'express';

import helmet from 'helmet';

import { createErrorResponse } from '@api/common';
import { csrfProtection } from '@api/middlewares/csrf-middleware';
import { createAppRoutes } from '@api/routes';
import { RouteNotFoundException } from '@application/common';

import { PORT, ALLOWED_ORIGINS, SHUTDOWN_TIMEOUT, IS_DEV_MODE, NODE_ENV } from '@common/config/app';
import { log } from '@common/utils/logger';
import { getAppDependencies, createDIContainer } from '@infrastructure/di';
import { disconnectPrisma, disconnectRedis, checkDatabase, checkRedis } from '@infrastructure/utils';

function setupExpressApp(controllers: ReturnType<typeof getAppDependencies>): Express {
    const app = express();

    app.use(helmet());
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // CORS with whitelist
    app.use((req, res, next) => {
        const origin = req.headers.origin;

        // В dev режиме разрешаем все origins
        if (IS_DEV_MODE) {
            if (origin) {
                res.header('Access-Control-Allow-Origin', origin);
                res.header('Access-Control-Allow-Credentials', 'true');
            }
        } else {
            // В production только whitelist
            if (origin && ALLOWED_ORIGINS.includes(origin)) {
                res.header('Access-Control-Allow-Origin', origin);
                res.header('Access-Control-Allow-Credentials', 'true');
            }
        }

        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });

    app.use(csrfProtection);

    const appRoutes = createAppRoutes(
        controllers.authController,
        controllers.userController,
        controllers.eventController,
        controllers.categoryController,
        controllers.commentController,
        controllers.notificationController,
        controllers.userTypeController,
        controllers.geocoderController,
        controllers.statisticsController,
        controllers.tokenManager,
    );

    app.use('/api', appRoutes);

    app.get('/health', async (req: Request, res: Response) => {
        const checks = {
            database: await checkDatabase(),
            redis: await checkRedis(),
            timestamp: new Date().toISOString(),
        };

        const isHealthy = Object.values(checks).every((v) => v === true);

        res.status(isHealthy ? 200 : 503).json(checks);
    });

    app.use((req: Request, res: Response) => {
        const errorResponse = createErrorResponse(new RouteNotFoundException());
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
            log.info(`Environment: ${NODE_ENV}`);

            if (IS_DEV_MODE) {
                log.warn('⚠️  DEV MODE: Security checks disabled');
                log.warn('⚠️  - CSRF Protection: disabled');
                log.warn('⚠️  - Rate Limiting: disabled');
                log.warn('⚠️  - CORS: allows all origins');
                log.warn('⚠️  - Email Verification: auto-verified');
                log.warn('⚠️  This is intended for testing through Postman/Insomnia');
                log.warn('⚠️  DO NOT use this configuration in production!');
            }
        });

        const shutdown = async (signal: string) => {
            log.info(`${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                log.info('HTTP server closed');

                await disconnectPrisma();
                await disconnectRedis();

                log.info('Graceful shutdown completed');
                process.exit(0);
            });

            setTimeout(() => {
                log.error(`Forced shutdown after ${SHUTDOWN_TIMEOUT}ms timeout`);
                process.exit(1);
            }, SHUTDOWN_TIMEOUT);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

        process.on('unhandledRejection', (reason) => {
            const error = reason instanceof Error ? reason : new Error(String(reason));
            log.error('Unhandled Promise Rejection', error);
        });

        process.on('uncaughtException', (error) => {
            log.error('Uncaught Exception', error);
            process.exit(1);
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        log.error('Failed to start server', err);
        process.exit(1);
    }
}

startServer();
