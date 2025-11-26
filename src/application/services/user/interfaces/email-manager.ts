import { EmailVerificationPurpose } from '@domain/models/auth';

export interface SendEmailVerificationParams {
    to: string;
    token: string;
    purpose: EmailVerificationPurpose;
}

export interface IEmailManager {
    sendEmailVerification(params: SendEmailVerificationParams): Promise<void>;
}
