import nodemailer from 'nodemailer';

import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } from '@common/config/email';
import { log } from '@common/utils/logger';

export const emailClient = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

(async () => {
    try {
        await emailClient.verify();
        log.info(`Successfully connected to SMTP server (${SMTP_HOST}:${SMTP_PORT})`);
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        log.error(`Failed to connect to SMTP server (${SMTP_HOST}:${SMTP_PORT})`, err);
        // process.exit(1);
    }
})();
