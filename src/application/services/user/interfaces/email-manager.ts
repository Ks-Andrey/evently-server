import { EmailVerificationPurpose } from '@common/constants/email-verification';

export interface SendEmailVerificationParams {
    to: string;
    token: string;
    purpose: EmailVerificationPurpose;
}

export interface IEmailManager {
    sendEmailVerification(params: SendEmailVerificationParams): Promise<void>;
}
