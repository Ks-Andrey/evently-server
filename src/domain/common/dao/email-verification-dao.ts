import { EmailVerification } from '../../user';

export interface IEmailVerificationDao {
    findByEmail(email: string): Promise<EmailVerification | null>;
    findById(email: string): Promise<EmailVerification | null>;
    save(email: EmailVerification): Promise<void>;
}
