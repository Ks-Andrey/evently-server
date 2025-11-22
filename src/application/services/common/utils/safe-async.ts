import { Result } from 'true-myth';

import { UnknownException } from '../exceptions';

export async function safeAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
    try {
        const value = await fn();
        return Result.ok(value);
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : typeof error === 'string' ? error : 'An unknown error occurred';

        return Result.err(new UnknownException(message));
    }
}
