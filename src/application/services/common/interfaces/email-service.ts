import { EmailVerificationPurpose } from '@domain/auth';

export interface IEmailService {
    sendEmailVerification(params: { to: string; token: string; purpose: EmailVerificationPurpose }): Promise<void>;
}
