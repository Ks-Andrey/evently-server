import rateLimit from 'express-rate-limit';

import { ERROR_MESSAGES } from '@common/constants/errors';

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: ERROR_MESSAGES.application.security.rateLimitExceeded,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});
