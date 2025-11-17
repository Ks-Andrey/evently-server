import { EMAIL_VERIFICATION_TTL_HOURS } from '@application/services/user/constants';
import { EmailVerification, EmailVerificationPurpose, IEmailVerificationRepository } from '@domain/auth';
import { NotFoundException } from '@domain/common';
import { IUserRepository, PendingEmailAlreadyRequestedException } from '@domain/user';
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
        private readonly emailVerificationRepo: IEmailVerificationRepository,
        private readonly emailService: IEmailService,
    ) {}

    execute(command: EditUserEmail): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();

            const normalizedEmail = command.newEmail.trim();

            const existingVerification = await this.emailVerificationRepo.findByEmail(normalizedEmail);
            if (existingVerification?.isActive()) throw new PendingEmailAlreadyRequestedException();

            await user.validPassword(command.password);
            user.requestEmailChange(normalizedEmail);

            const verification = EmailVerification.create(
                v4() as UUID,
                user.id,
                normalizedEmail,
                EmailVerificationPurpose.EMAIL_CHANGE,
                new Date(Date.now() + EMAIL_VERIFICATION_TTL_HOURS * 60 * 60 * 1000),
            );

            await this.emailVerificationRepo.save(verification);
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
