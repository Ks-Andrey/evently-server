import { Request, Response, NextFunction } from 'express';

import { createErrorResponse } from '@api/common/utils/error-handler';
import { CsrfInvalidOriginException, CsrfOriginRequiredException } from '@application/common';

import { ALLOWED_ORIGINS, IS_DEV_MODE } from '@common/config/app';
import { log } from '@common/utils/logger';

export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
    if (IS_DEV_MODE) {
        log.debug('CSRF protection skipped in dev mode');
        return next();
    }

    const method = req.method;

    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        return next();
    }

    const origin = req.headers.origin;
    const referer = req.headers.referer;

    if (!origin && !referer) {
        if (req.headers.authorization) {
            return next();
        }
        const errorResponse = createErrorResponse(new CsrfOriginRequiredException());
        res.status(errorResponse.status).json(errorResponse);
        return;
    }

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        return next();
    }

    if (referer) {
        const refererUrl = new URL(referer);
        const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
        if (ALLOWED_ORIGINS.includes(refererOrigin)) {
            return next();
        }
    }

    const errorResponse = createErrorResponse(new CsrfInvalidOriginException());
    res.status(errorResponse.status).json(errorResponse);
}
