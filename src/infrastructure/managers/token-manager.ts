import jwt from 'jsonwebtoken';

import { ITokenManager } from '@application/services/auth';
import { secret, accessTokenTtlSeconds, refreshTokenTtlSeconds } from '@common/config/token';
import { Tokens, TokenType, UserJwtPayload } from '@common/types/auth';

import { redisClient } from '../utils';

export class TokenManager implements ITokenManager {
    async issueTokens(payload: UserJwtPayload): Promise<Tokens> {
        const accessToken = jwt.sign(payload, secret, {
            expiresIn: accessTokenTtlSeconds,
        });

        const refreshToken = jwt.sign(payload, secret, {
            expiresIn: refreshTokenTtlSeconds,
        });

        const refreshKey = this.getRefreshTokenKey(payload.userId, refreshToken);
        await redisClient.setEx(refreshKey, refreshTokenTtlSeconds, '1');

        return {
            accessToken,
            refreshToken,
        };
    }

    async verifyToken(token: string, type: TokenType = 'access'): Promise<UserJwtPayload | null> {
        const decoded = jwt.verify(token, secret) as UserJwtPayload;

        const revoked = await this.isTokenRevoked(token, type, decoded.userId);
        if (revoked) return null;

        return decoded;
    }

    async revokeToken(token: string, type: TokenType = 'access', userId?: string): Promise<void> {
        const key = type === 'refresh' ? this.getRefreshTokenKey(userId!, token) : this.getRevokedTokenKey(token, type);

        const decoded = jwt.decode(token) as any;
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        await redisClient.setEx(key, ttl, '1');
    }

    private async isTokenRevoked(token: string, type: TokenType, userId?: string): Promise<boolean> {
        const key = type === 'refresh' ? this.getRefreshTokenKey(userId!, token) : this.getRevokedTokenKey(token, type);

        const result = await redisClient.get(key);
        return result !== null && result === '1';
    }

    private getRevokedTokenKey(token: string, type: TokenType): string {
        return `revoked_token:${type}:${token}`;
    }

    private getRefreshTokenKey(userId: string, token: string): string {
        return `refresh_token:${userId}:${token}`;
    }
}
