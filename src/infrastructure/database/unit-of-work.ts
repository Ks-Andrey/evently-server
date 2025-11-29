import { IUnitOfWork } from '@common/types/unit-of-work';
import { PrismaClient } from '@generated/prisma/client';

import { prisma } from './prisma-client';

type PrismaTransactionClient = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export class PrismaUnitOfWork implements IUnitOfWork {
    private transactionClient: PrismaTransactionClient | null = null;

    constructor() {}

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

    async begin(): Promise<void> {}

    async commit(): Promise<void> {}

    async rollback(): Promise<void> {}
}
