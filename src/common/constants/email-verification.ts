import { Enum } from '../types/enum';

export const EMAIL_VERIFICATION_TTL = 24 * 60 * 60 * 1000;

export const EmailVerificationPurpose = {
    REGISTRATION: 'REGISTRATION',
    EMAIL_CHANGE: 'EMAIL_CHANGE',
} as const;
export type EmailVerificationPurpose = Enum<typeof EmailVerificationPurpose>;
