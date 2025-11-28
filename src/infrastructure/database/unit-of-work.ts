import { PrismaClient } from '@generated/prisma/client';

import { IUnitOfWork } from '@common/types/unit-of-work';

import { getPrismaClient } from './prisma-client';

type PrismaTransactionClient = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export class PrismaUnitOfWork implements IUnitOfWork {
    private prisma: PrismaClient;
    private transactionClient: PrismaTransactionClient | null = null;

    constructor() {
        this.prisma = getPrismaClient();
    }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        return this.prisma.$transaction(async (tx: PrismaTransactionClient) => {
            this.transactionClient = tx;
            try {
                const result = await fn();
                return result;
            } finally {
                this.transactionClient = null;
            }
        });
    }

    async begin(): Promise<void> {}

    async commit(): Promise<void> {}

    async rollback(): Promise<void> {}

    getClient(): PrismaTransactionClient | PrismaClient {
        return this.transactionClient || this.prisma;
    }

    getMainClient(): PrismaClient {
        return this.prisma;
    }
}
