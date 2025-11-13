import { Result } from 'true-myth';

import { UnknownError } from '../../../domain/common';

export async function safeAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
    try {
        const value = await fn();
        return Result.ok(value);
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : typeof error === 'string' ? error : 'An unknown error occurred';

        return Result.err(new UnknownError(message));
    }
}
