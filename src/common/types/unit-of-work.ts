import { PrismaClient } from '@generated/prisma/client';

type PrismaTransactionClient = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export interface IUnitOfWork {
    getClient(): PrismaTransactionClient | PrismaClient;
    execute<T>(fn: () => Promise<T>): Promise<T>;
}
