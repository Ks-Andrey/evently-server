import { PrismaPg } from '@prisma/adapter-pg';

import { DATABASE_URL } from '@common/config/database';
import { log } from '@common/utils/logger';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export type PrismaTransactionClient = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

(async () => {
    try {
        await prisma.$connect();
        log.info('Successfully connected to PostgreSQL database');
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        log.error('Failed to connect to PostgreSQL database', err);
        process.exit(1);
    }
})();

export const disconnectPrisma = async () => {
    try {
        await prisma.$disconnect();
        log.info('Disconnected from PostgreSQL database');
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        log.error('Failed to disconnect from PostgreSQL database', err);
    }
};

export const checkDatabase = async (): Promise<boolean> => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        log.error('PostgreSQL health check failed', err);
        return false;
    }
};

export { prisma };
