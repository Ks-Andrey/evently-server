import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { executeInTransaction, AccessDeniedException, ApplicationException } from '@application/common';
import { EMAIL_VERIFICATION_TTL } from '@common/constants/email-verification';
import { Roles } from '@common/constants/roles';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { EmailVerification, IEmailVerificationRepository, EmailVerificationPurpose } from '@domain/identity/auth';
import { IUserRepository } from '@domain/identity/user';

import { UserNotFoundException, EmailVerificationForUserAlreadyRequestedException } from '../exceptions';
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
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: EditUserEmail): Promise<Result<UUID, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();
            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            const normalizedEmail = command.newEmail.trim();

            const existingVerification = await this.emailVerificationRepo.findByEmail(normalizedEmail);
            if (existingVerification?.isActive()) throw new EmailVerificationForUserAlreadyRequestedException();

            await user.ensureValidPassword(command.password);
            user.requestEmailChange(normalizedEmail);

            const verification = EmailVerification.create(
                v4() as UUID,
                user.id,
                normalizedEmail,
                EmailVerificationPurpose.EMAIL_CHANGE,
                new Date(Date.now() + EMAIL_VERIFICATION_TTL),
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
