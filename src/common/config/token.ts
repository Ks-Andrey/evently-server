import { config } from 'dotenv';

config();

const parseTtl = (value: string | undefined, fallback: number): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const accessTokenTtlSeconds = parseTtl(process.env.JWT_ACCESS_TTL, 60 * 15);
export const refreshTokenTtlSeconds = parseTtl(process.env.JWT_REFRESH_TTL, 60 * 60 * 24 * 7);
