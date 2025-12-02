import { getEnv, requireEnv } from '../utils/requireEnv';

export const FRONTEND_URL = requireEnv('FRONTEND_URL');
export const SMTP_HOST = requireEnv('SMTP_HOST');
export const SMTP_PORT = getEnv('SMTP_PORT', 587);
export const SMTP_USER = requireEnv('SMTP_USER');
export const SMTP_PASSWORD = requireEnv('SMTP_PASSWORD');
