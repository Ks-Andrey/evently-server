import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, executeInTransaction } from '@application/common';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { EmailVerificationPurpose, IEmailVerificationRepository } from '@domain/identity/auth';
import { IUserRepository } from '@domain/identity/user';

import { EmailVerificationNotFoundException, UserForAuthNotFoundException } from '../exceptions';

export class ConfirmUserEmail {
    constructor(readonly token: UUID) {}
}

export class ConfirmUserEmailHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly emailVerificationRepo: IEmailVerificationRepository,
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: ConfirmUserEmail): Promise<Result<UUID, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
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
