import { Result } from 'true-myth';

import { getErrorMessage } from '@common/utils/error';
import { DomainException } from '@domain/common';

import { ApplicationErrorCodes } from '../exceptions/error-codes';
import { ApplicationException, UnknownException } from '../exceptions/exceptions';

export async function safeAsync<T>(fn: () => Promise<T>): Promise<Result<T, ApplicationException>> {
    try {
        const value = await fn();
        return Result.ok(value);
    } catch (error: unknown) {
        if (error instanceof ApplicationException) {
            return Result.err(error);
        }

        if (error instanceof DomainException) {
            return Result.err(new ApplicationException(error.message, ApplicationErrorCodes.BUSINESS_RULE_VIOLATION));
        }

        return Result.err(new UnknownException(getErrorMessage(error) || undefined));
    }
}
