import { Result } from 'true-myth';

import { IUnitOfWork } from '@common/types/unit-of-work';

import { safeAsync } from './safe-async';
import { ApplicationException } from '../exceptions/exceptions';

export async function executeInTransaction<T>(
    unitOfWork: IUnitOfWork,
    fn: () => Promise<T>,
): Promise<Result<T, ApplicationException>> {
    return safeAsync(async () => {
        return await unitOfWork.execute(async () => {
            return await fn();
        });
    });
}
