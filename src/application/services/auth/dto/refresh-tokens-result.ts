import { Tokens } from '@common/types/auth';

export class RefreshTokensResult {
    private constructor(
        readonly accessToken: string,
        readonly refreshToken: string,
    ) {}

    static create(tokens: Tokens): RefreshTokensResult {
        return new RefreshTokensResult(tokens.accessToken, tokens.refreshToken);
    }
}
