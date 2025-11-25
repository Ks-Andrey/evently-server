import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { EmailVerificationPurpose, IEmailVerificationRepository } from '@domain/models/auth';
import { IUserRepository } from '@domain/models/user';

import { EmailVerificationNotFoundException, UserForAuthNotFoundException } from '../exceptions';

export class ConfirmUserEmail {
    constructor(readonly token: UUID) {}
}

export class ConfirmUserEmailHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly emailVerificationRepo: IEmailVerificationRepository,
    ) {}

    execute(command: ConfirmUserEmail): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            const verification = await this.emailVerificationRepo.findById(command.token);
            if (!verification) throw new EmailVerificationNotFoundException();

            verification.ensureIsActive();

            const user = await this.userRepo.findById(verification.userId);
            if (!user) throw new UserForAuthNotFoundException();

            if (verification.purpose === EmailVerificationPurpose.REGISTRATION) {
                user.markEmailVerified();
            } else if (verification.purpose === EmailVerificationPurpose.EMAIL_CHANGE) {
                user.confirmPendingEmail(verification.email);
            }

            verification.markUsed();

            await this.userRepo.save(user);
            await this.emailVerificationRepo.save(verification);

            return user.id;
        });
    }
}
