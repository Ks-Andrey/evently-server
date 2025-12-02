import { getEnv } from '../utils/requireEnv';

export const redisUrl = getEnv('REDIS_URL', 'redis://127.0.0.1:6379');
