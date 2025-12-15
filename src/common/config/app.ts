import { getEnv, requireEnv } from '../utils/require-env';

export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const PORT = getEnv('PORT', 3000);
export const TEMP_UPLOADS_DIR = getEnv('TEMP_UPLOADS_DIR', 'temp-uploads');
export const UPLOADS_DIR = getEnv('UPLOADS_DIR', 'uploads');
export const SHUTDOWN_TIMEOUT = getEnv('SHUTDOWN_TIMEOUT', 10000);
export const BASE_URL = getEnv('BASE_URL', `http://localhost:${PORT}`);
export const FRONTEND_URL = requireEnv('FRONTEND_URL');

export const IS_DEV_MODE = NODE_ENV === 'development';
export const IS_PROD_MODE = NODE_ENV === 'production';

export const ALLOWED_ORIGINS = requireEnv('ALLOWED_ORIGINS')
    .split(',')
    .map((origin) => origin.trim());
