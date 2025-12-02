import { config } from 'dotenv';

import { log } from './logger';

config();

export function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        log.error(`Environment variable ${key} is required`);
        process.exit(1);
    }
    return value;
}

export function getEnv(key: string, defaultValue: string): string;
export function getEnv(key: string, defaultValue: number): number;

export function getEnv(key: string, defaultValue: string | number): string | number {
    const value = process.env[key];

    if (!value) {
        return defaultValue;
    }

    if (typeof defaultValue === 'number') {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
            log.error(`Environment variable ${key} is required`);
            process.exit(1);
        }
        return parsed;
    }

    return value;
}
