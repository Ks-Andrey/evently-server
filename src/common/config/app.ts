import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 3000;
export const TEMP_UPLOADS_DIR = process.env.TEMP_UPLOADS_DIR || 'temp-uploads';
export const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads';
