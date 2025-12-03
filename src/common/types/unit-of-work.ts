import { PrismaTransactionClient } from '@infrastructure/utils';
import { PrismaClient } from '@prisma/client';

export interface IUnitOfWork {
    getClient(): PrismaTransactionClient | PrismaClient;
    execute<T>(fn: () => Promise<T>): Promise<T>;
}
