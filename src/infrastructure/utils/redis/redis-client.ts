import { createClient, RedisClientType } from 'redis';

import { redisUrl } from '@common/config/redis';
import { log } from '@common/utils/logger';

const redisClient: RedisClientType = createClient({ url: redisUrl });

redisClient.on('error', (err) => {
    log.error('Redis Client Error', { error: err });
});

(async () => {
    try {
        await redisClient.connect();
        log.info('Successfully connected to Redis');
    } catch (error) {
        log.error('Failed to connect to Redis', { error });

        process.exit(1);
    }
})();

export const disconnectRedis = async () => {
    try {
        await redisClient.quit();
        log.info('Successfully disconnected from Redis');
    } catch (error) {
        log.error('Failed to disconnect from Redis', { error });
    }
};

export { redisClient };
