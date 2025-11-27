import { config } from 'dotenv';
config();

export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const LOG_DIR = process.env.LOG_DIR || 'logs';
