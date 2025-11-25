import { EmailVerificationPurpose } from '@domain/models/auth';

export interface IEmailManager {
    sendEmailVerification(params: { to: string; token: string; purpose: EmailVerificationPurpose }): Promise<void>;
}
