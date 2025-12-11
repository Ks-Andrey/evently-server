import jwt from 'jsonwebtoken';

import {
    ExpiredTokenException,
    InvalidTokenException,
    TokenSignException,
    TokenVerifyException,
} from '@application/services/auth';
import { ITokenManager } from '@application/services/auth';
import { secret, accessTokenTtlSeconds, refreshTokenTtlSeconds } from '@common/config/token';
import { Tokens, TokenType, UserJwtPayload } from '@common/types/auth';
import { getErrorMessage } from '@common/utils/error';
import { log } from '@common/utils/logger';
import { InvalidTokenPayloadException } from '@domain/identity/auth';

import { redisClient } from '../utils';

export class TokenManager implements ITokenManager {
    async issueTokens(payload: UserJwtPayload): Promise<Tokens> {
        try {
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
        } catch (error: unknown) {
            log.error('Error issuing tokens', {
                userId: payload.userId,
                error: log.formatError(error),
            });

            throw new TokenSignException({
                userId: payload.userId,
                error: getErrorMessage(error),
            });
        }
    }

    async verifyToken(token: string, type: TokenType = 'access'): Promise<UserJwtPayload | null> {
        try {
            const decoded = jwt.verify(token, secret) as UserJwtPayload;

            if (type === 'refresh') {
                const isActive = await this.isRefreshTokenActive(token, decoded.userId);
                if (!isActive) return null;
            } else {
                const revoked = await this.isTokenRevoked(token, type);
                if (revoked) return null;
            }

            return decoded;
        } catch (error: unknown) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ExpiredTokenException({
                    type,
                    expiredAt: error.expiredAt,
                });
            }

            if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenException({
                    type,
                    message: error.message,
                });
            }

            log.error('Error verifying token', {
                type,
                error: log.formatError(error),
            });

            throw new TokenVerifyException({
                type,
                error: getErrorMessage(error),
            });
        }
    }

    async revokeToken(token: string, type: TokenType = 'access', userId?: string): Promise<void> {
        if (type === 'refresh') {
            if (!userId) {
                const decoded = jwt.decode(token, { complete: false }) as UserJwtPayload | null;
                if (!decoded || typeof decoded === 'string') {
                    throw new InvalidTokenPayloadException();
                }
                userId = decoded.userId;
            }
            const refreshKey = this.getRefreshTokenKey(userId, token);
            await redisClient.del(refreshKey);
        } else {
            // Для access токена помечаем как отозванный
            const key = this.getRevokedTokenKey(token, type);
            const decoded = jwt.decode(token, { complete: false });
            if (!decoded || typeof decoded === 'string' || typeof decoded.exp !== 'number') {
                throw new InvalidTokenPayloadException();
            }
            const ttl = decoded.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                await redisClient.setEx(key, ttl, '1');
            }
        }
    }

    private async isRefreshTokenActive(token: string, userId: string): Promise<boolean> {
        const key = this.getRefreshTokenKey(userId, token);
        const result = await redisClient.get(key);
        return result !== null && result === '1';
    }

    private async isTokenRevoked(token: string, type: TokenType): Promise<boolean> {
        const key = this.getRevokedTokenKey(token, type);
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
