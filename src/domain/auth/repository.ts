import { EmailVerification } from './entities/email-verification';

export interface IEmailVerificationRepository {
    findByEmail(email: string): Promise<EmailVerification | null>;
    findById(id: string): Promise<EmailVerification | null>;
    save(emailVerification: EmailVerification): Promise<void>;
}
