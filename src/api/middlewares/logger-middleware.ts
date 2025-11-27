import { Request, Response, NextFunction } from 'express';

import { log } from '@common/utils/logger';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    log.http('Incoming Request', {
        method: req.method,
        url: req.url,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });

    const originalSend = res.send;
    res.send = function (body) {
        const duration = Date.now() - startTime;

        log.http('Outgoing Response', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });

        return originalSend.call(this, body);
    };

    next();
};
