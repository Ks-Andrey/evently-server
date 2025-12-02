import { parseTtl } from '../utils/parseInt';
import { requireEnv } from '../utils/requireEnv';

const jwtSecret = requireEnv('JWT_SECRET');
if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long for security');
}

export const secret = jwtSecret;
export const accessTokenTtlSeconds = parseTtl(process.env.JWT_ACCESS_TTL, 60 * 15);
export const refreshTokenTtlSeconds = parseTtl(process.env.JWT_REFRESH_TTL, 60 * 60 * 24 * 7);
