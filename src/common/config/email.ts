import { config } from 'dotenv';
config();

export const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
export const SMTP_HOST = process.env.SMTP_HOST ?? 'smtp.gmail.com';
export const SMTP_PORT = process.env.SMTP_PORT ?? 587;
export const SMTP_USER = process.env.SMTP_USER ?? 'your-email@gmail.com';
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD ?? 'your-password';
