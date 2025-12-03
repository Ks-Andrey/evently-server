import rateLimit from 'express-rate-limit';

import { IS_DEV_MODE } from '@common/config/app';
import { ERROR_MESSAGES } from '@common/constants/errors';
import { log } from '@common/utils/logger';

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: ERROR_MESSAGES.application.security.rateLimitExceeded,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skip: (req) => {
        if (IS_DEV_MODE) {
            log.debug('Rate limiting skipped in dev mode', { path: req.path });
            return true;
        }
        return false;
    },
});
