import { config } from 'dotenv';
config();

export function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required`);
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
            throw new Error(`Environment variable ${key} must be a valid number`);
        }
        return parsed;
    }

    return value;
}
