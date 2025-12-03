import { IUnitOfWork } from '@common/types/unit-of-work';
import { PrismaClient } from '@prisma/client';

import { prisma, PrismaTransactionClient } from './prisma-client';

export class PrismaUnitOfWork implements IUnitOfWork {
    private transactionClient: PrismaTransactionClient | null = null;

    constructor() {}

    getClient(): PrismaTransactionClient | PrismaClient {
        return this.transactionClient || prisma;
    }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        return prisma.$transaction(async (tx: PrismaTransactionClient) => {
            this.transactionClient = tx;
            try {
                const result = await fn();
                return result;
            } finally {
                this.transactionClient = null;
            }
        });
    }
}
