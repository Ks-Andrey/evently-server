import { EmailVerificationPurpose } from '@domain/auth';

export interface IEmailManager {
    sendEmailVerification(params: { to: string; token: string; purpose: EmailVerificationPurpose }): Promise<void>;
}
