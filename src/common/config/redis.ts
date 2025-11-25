import { config } from 'dotenv';
import { createClient, RedisClientType } from 'redis';

config();

const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';

export const redisClient: RedisClientType = createClient({
    url: redisUrl,
});

let connectPromise: Promise<RedisClientType> | null = null;

export const ensureRedisConnection = async (): Promise<void> => {
    if (!connectPromise) {
        connectPromise = redisClient.connect();
        connectPromise.catch((error) => {
            connectPromise = null;
            throw error;
        });
    }

    await connectPromise;
};
