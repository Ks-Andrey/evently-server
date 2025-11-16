import { EmailVerificationPurpose } from '@domain/user';

export interface IEmailService {
    sendEmailVerification(params: { to: string; token: string; purpose: EmailVerificationPurpose }): Promise<void>;
}
