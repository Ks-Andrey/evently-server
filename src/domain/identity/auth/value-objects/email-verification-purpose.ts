import { Enum } from '@common/types/enum';

export const EmailVerificationPurpose = {
    REGISTRATION: 'REGISTRATION',
    EMAIL_CHANGE: 'EMAIL_CHANGE',
} as const;
export type EmailVerificationPurpose = Enum<typeof EmailVerificationPurpose>;
