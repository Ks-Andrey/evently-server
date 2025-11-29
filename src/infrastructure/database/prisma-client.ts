import { PrismaPg } from '@prisma/adapter-pg';

import { DATABASE_URL } from '@common/config/database';
import { log } from '@common/utils/logger';
import { PrismaClient } from '@generated/prisma/client';

let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
    try {
        const adapter = new PrismaPg({ connectionString: DATABASE_URL });
        if (!prisma) {
            prisma = new PrismaClient({ adapter });
        }
        return prisma;
    } catch (error) {
        log.error('Failed to create Prisma client', { error });
        throw error;
    }
}

export async function disconnectPrisma(): Promise<void> {
    if (prisma) {
        try {
            await prisma.$disconnect();
        } catch (error) {
            log.error('Failed to disconnect Prisma client', { error });
            throw error;
        }
    }
}
