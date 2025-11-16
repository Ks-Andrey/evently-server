import { IEmailVerificationDao, NotFoundError } from '@domain/common';
import {
    EmailVerificationNotFoundException,
    EmailVerificationPurpose,
    EmailVerificationTokenCannotBeEmptyException,
    IUserRepository,
} from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class ConfirmUserEmail {
    constructor(readonly userId: UUID) {}
}

export class ConfirmUserEmailHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly emailVerificationDao: IEmailVerificationDao,
    ) {}

    execute(command: ConfirmUserEmail): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            if (!command.userId) throw new EmailVerificationTokenCannotBeEmptyException();

            const verification = await this.emailVerificationDao.findById(command.userId);
            if (!verification) throw new EmailVerificationNotFoundException();
            verification.ensureIsActive();

            const user = await this.userRepo.findById(verification.userId);
            if (!user) throw new NotFoundError();

            if (verification.purpose === EmailVerificationPurpose.REGISTRATION) {
                user.markEmailVerified();
            } else if (verification.purpose === EmailVerificationPurpose.EMAIL_CHANGE) {
                user.confirmPendingEmail(verification.email);
            }

            verification.markUsed();

            await this.userRepo.save(user);
            await this.emailVerificationDao.save(verification);

            return user.id;
        });
    }
}
