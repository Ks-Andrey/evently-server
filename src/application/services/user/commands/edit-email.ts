import { UUID } from 'crypto';

import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { safeAsync, NotFoundException, AccessDeniedException } from '@application/services/common';
import { Roles } from '@common/config/roles';
import { EmailVerification, EmailVerificationPurpose, IEmailVerificationRepository } from '@domain/auth';
import { IUserRepository, PendingEmailAlreadyRequestedException } from '@domain/user';

import { EMAIL_VERIFICATION_TTL_HOURS } from '../constants';
import { IEmailManager } from '../interfaces/email-manager';

export class EditUserEmail {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly password: string,
        readonly newEmail: string,
    ) {}
}

export class EditUserEmailHandler {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly emailVerificationRepo: IEmailVerificationRepository,
        private readonly emailService: IEmailManager,
    ) {}

    execute(command: EditUserEmail): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();
            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

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
