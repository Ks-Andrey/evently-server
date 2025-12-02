import { EmailVerificationPurpose } from '@domain/identity/auth';

export interface SendEmailVerificationParams {
    to: string;
    token: string;
    purpose: EmailVerificationPurpose;
}

export interface IEmailManager {
    sendEmailVerification(params: SendEmailVerificationParams): Promise<void>;
}
