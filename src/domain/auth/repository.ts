import { IRepository } from '@common/types/repository';

import { EmailVerification } from './aggregate';

export interface IEmailVerificationRepository extends IRepository<EmailVerification> {
    findByEmail(email: string): Promise<EmailVerification | null>;
}
