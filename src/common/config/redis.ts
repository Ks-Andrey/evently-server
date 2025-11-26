import { config } from 'dotenv';
config();

export const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
