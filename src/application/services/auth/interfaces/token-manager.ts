import { Tokens, TokenType, UserJwtPayload } from '@common/types/auth';

export interface ITokenManager {
    issueTokens(payload: UserJwtPayload): Promise<Tokens>;
    verifyToken(token: string, type?: TokenType): Promise<UserJwtPayload | null>;
    revokeToken(token: string, type?: TokenType, userId?: string): Promise<void>;
}
