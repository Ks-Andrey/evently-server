import { Tokens } from '@common/types/auth';

export class AuthenticateUserResult {
    private constructor(
        readonly accessToken: string,
        readonly refreshToken: string,
    ) {}

    static create(tokens: Tokens): AuthenticateUserResult {
        return new AuthenticateUserResult(tokens.accessToken, tokens.refreshToken);
    }
}
