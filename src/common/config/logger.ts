import { getEnv } from '../utils/requireEnv';

export const LOG_LEVEL = getEnv('LOG_LEVEL', 'development');
export const LOG_DIR = getEnv('LOG_DIR', 'logs');
