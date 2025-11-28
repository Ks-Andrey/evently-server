import { PrismaClient } from '@generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { DATABASE_URL } from '@common/config/database';

let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
    const adapter = new PrismaPg({ connectionString: DATABASE_URL });
    if (!prisma) {
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
}

export async function disconnectPrisma(): Promise<void> {
    if (prisma) {
        await prisma.$disconnect();
    }
}
