import { EmailSendException } from '@application/services/user';
import { IEmailManager, SendEmailVerificationParams } from '@application/services/user';
import { FRONTEND_URL } from '@common/config/app';
import { getErrorMessage } from '@common/utils/error';
import { log } from '@common/utils/logger';

import { emailClient } from '../utils';

export class EmailManager implements IEmailManager {
    async sendEmailVerification(params: SendEmailVerificationParams): Promise<void> {
        const { to, token } = params;

        const verificationUrl = `${FRONTEND_URL}/auth/confirm-email/${token}`;
        const subject = 'Подтвердите ваш email';
        const body = this.getEmailTemplate(verificationUrl);

        try {
            await emailClient.sendMail({
                to,
                subject,
                html: body,
            });

            log.info('Email verification sent successfully', {
                recipient: to,
            });
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error);

            // Специальная обработка для rate limiting от SMTP сервера
            if (errorMessage.includes('454') || errorMessage.includes('Try again later')) {
                log.error('Email rate limit exceeded', {
                    recipient: to,
                    provider: 'Yandex SMTP',
                    reason: 'Rate limiting or temporary block',
                    suggestion: 'Wait a few minutes before retrying',
                    originalError: errorMessage,
                });
            } else {
                log.error('Failed to send email', {
                    recipient: to,
                    originalError: errorMessage,
                });
            }

            throw new EmailSendException({
                to,
                error: errorMessage,
            });
        }
    }

    private getEmailTemplate(verificationUrl: string): string {
        return `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Подтверждение email</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 50px auto;
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        text-align: center;
                    }
                    h1 {
                        color: #333333;
                    }
                    p {
                        color: #555555;
                        font-size: 16px;
                    }
                    a.button {
                        display: inline-block;
                        padding: 12px 20px;
                        margin-top: 20px;
                        background-color: #4CAF50;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    a.button:hover {
                        background-color: #45a049;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 12px;
                        color: #999999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Подтверждение email</h1>
                    <p>Пожалуйста, нажмите на кнопку ниже, чтобы подтвердить ваш email адрес:</p>
                    <a href="${verificationUrl}" class="button">Подтвердить email</a>
                    <p class="footer">Если вы не запрашивали это подтверждение, просто проигнорируйте это письмо.</p>
                </div>
            </body>
            </html>
        `;
    }
}
