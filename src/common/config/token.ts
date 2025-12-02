import { parseTtl } from '../utils/parseInt';
import { requireEnv } from '../utils/requireEnv';

export const secret = requireEnv('JWT_SECRET');
export const accessTokenTtlSeconds = parseTtl(process.env.JWT_ACCESS_TTL, 60 * 15);
export const refreshTokenTtlSeconds = parseTtl(process.env.JWT_REFRESH_TTL, 60 * 60 * 24 * 7);
