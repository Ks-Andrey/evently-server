import { createClient, RedisClientType } from 'redis';

import { redisUrl } from '@common/config/redis';
import { log } from '@common/utils/logger';

const redisClient: RedisClientType = createClient({ url: redisUrl });

redisClient.on('error', (err) => {
    const error = err instanceof Error ? err : new Error(String(err));
    log.error('Redis Client Error', error);
});

(async () => {
    try {
        await redisClient.connect();
        log.info('Successfully connected to Redis');
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        log.error('Failed to connect to Redis', err);
        process.exit(1);
    }
})();

export const disconnectRedis = async () => {
    try {
        await redisClient.quit();
        log.info('Disconnected from Redis');
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        log.error('Failed to disconnect from Redis', err);
    }
};

export const checkRedis = async (): Promise<boolean> => {
    try {
        await redisClient.ping();
        return true;
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        log.error('Redis health check failed', err);
        return false;
    }
};
export { redisClient };
