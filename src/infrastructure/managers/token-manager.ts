import { createHash } from 'crypto';

import jwt, { JwtPayload } from 'jsonwebtoken';

import { ensureRedisConnection, redisClient } from '@common/config/redis';
import { secret } from '@common/config/secret';
import { accessTokenTtlSeconds, refreshTokenTtlSeconds } from '@common/config/token';
import { TokenType, UserJwtPayload } from '@common/types/auth';
import { InactiveTokenException, InvalidTokenPayloadException } from '@domain/models/auth';

const composeKey = (token: string, type: TokenType): string => {
    const hashed = createHash('sha256').update(token).digest('hex');
    return `tokens:${type}:${hashed}`;
};

const isTokenActive = async (token: string, type: TokenType): Promise<boolean> => {
    await ensureRedisConnection();
    const exists = await redisClient.exists(composeKey(token, type));
    return exists > 0;
};

export const issueTokens = async (payload: UserJwtPayload): Promise<{ accessToken: string; refreshToken: string }> => {
    const accessToken = jwt.sign(payload, secret, { expiresIn: accessTokenTtlSeconds });
    const refreshToken = jwt.sign(payload, secret, { expiresIn: refreshTokenTtlSeconds });

    await ensureRedisConnection();

    await redisClient.set(composeKey(accessToken, 'access'), '1', { EX: accessTokenTtlSeconds });
    await redisClient.set(composeKey(refreshToken, 'refresh'), '1', { EX: refreshTokenTtlSeconds });

    return { accessToken, refreshToken };
};

export const verifyToken = async (token: string, type: TokenType = 'access'): Promise<UserJwtPayload> => {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded || typeof decoded !== 'object' || !decoded.userId || !decoded.role) {
        throw new InvalidTokenPayloadException();
    }

    const active = await isTokenActive(token, type);
    if (!active) throw new InactiveTokenException();

    return {
        userId: decoded.userId,
        role: decoded.role,
    };
};

export const revokeToken = async (token: string, type: TokenType = 'access'): Promise<void> => {
    await ensureRedisConnection();
    await redisClient.del(composeKey(token, type));
};
