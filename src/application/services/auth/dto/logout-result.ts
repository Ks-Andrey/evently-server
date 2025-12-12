import { MESSAGES } from '@common/constants/messages';

export class LogoutResult {
    private constructor(
        readonly success: boolean,
        readonly message: string,
    ) {}

    static create(): LogoutResult {
        return new LogoutResult(true, MESSAGES.result.auth.loggedOut);
    }
}
