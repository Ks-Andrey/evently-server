import { PrismaPg } from '@prisma/adapter-pg';

import { DATABASE_URL } from '@common/config/database';
import { log } from '@common/utils/logger';
import { PrismaClient } from '@generated/prisma/client';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

(async () => {
    try {
        await prisma.$connect();
        log.info('Successfully connected to the database');
    } catch (error) {
        log.error('Failed to connect to the database', { error });

        process.exit(1);
    }
})();

export const disconnectPrisma = async () => {
    try {
        await prisma.$disconnect();
        log.info('Successfully disconnected from the database');
    } catch (error) {
        log.error('Failed to disconnect from the database', { error });
    }
};

export { prisma };
