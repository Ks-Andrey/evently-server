import { EMAIL_VERIFICATION_TTL_HOURS } from '@application/user/constants';
import { IEmailVerificationDao, NotFoundError } from '@domain/common';
import {
    EmailVerification,
    EmailVerificationPurpose,
    IUserRepository,
    PasswordNotVerified,
    PendingEmailAlreadyRequestedException,
} from '@domain/user';
import { Result } from 'true-myth';

import { v4 } from 'uuid';

import { UUID } from 'crypto';

import { IEmailService, safeAsync } from '../../common';

export class EditUserEmail {
    constructor(
        readonly userId: UUID,
        readonly password: string,
        readonly newEmail: string,
    ) {}
}

export class EditUserEmailHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly emailVerificationDao: IEmailVerificationDao,
        private readonly emailService: IEmailService,
    ) {}

    execute(command: EditUserEmail): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundError();

            const normalizedEmail = command.newEmail.trim();

            const existingVerification = await this.emailVerificationDao.findByEmail(normalizedEmail);
            if (existingVerification && !existingVerification.isExpired() && !existingVerification.isUsed) {
                throw new PendingEmailAlreadyRequestedException();
            }

            const isPasswordValid = await user.validPassword(command.password);
            if (!isPasswordValid) throw new PasswordNotVerified();

            user.requestEmailChange(normalizedEmail);

            const verification = EmailVerification.create(
                v4() as UUID,
                user.id,
                normalizedEmail,
                EmailVerificationPurpose.EMAIL_CHANGE,
                new Date(Date.now() + EMAIL_VERIFICATION_TTL_HOURS * 60 * 60 * 1000),
            );

            await this.emailVerificationDao.save(verification);
            await this.userRepo.save(user);

            await this.emailService.sendEmailVerification({
                to: verification.email,
                token: verification.id,
                purpose: verification.purpose,
            });

            return user.id;
        });
    }
}
