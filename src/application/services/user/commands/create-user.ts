import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { ApplicationException, executeInTransaction } from '@application/common';
import { EMAIL_VERIFICATION_TTL } from '@common/constants/email-verification';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { EmailVerification, EmailVerificationPurpose, IEmailVerificationRepository } from '@domain/identity/auth';
import { IUserRepository, User, UserTypeData } from '@domain/identity/user';
import { IUserTypeRepository } from '@domain/identity/user-type';

import { UserAlreadyExistsException, UserTypeNotFoundException } from '../exceptions';
import { IEmailManager } from '../interfaces/email-manager';

export class CreateUser {
    constructor(
        readonly userTypeId: UUID,
        readonly username: string,
        readonly email: string,
        readonly password: string,
    ) {}
}

export class CreateUserHandler {
    constructor(
        readonly userRepo: IUserRepository,
        readonly userTypeRepo: IUserTypeRepository,
        private readonly emailVerificationRepo: IEmailVerificationRepository,
        private readonly emailService: IEmailManager,
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    execute(command: CreateUser): Promise<Result<UUID, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const exists = await this.userRepo.findByEmail(command.email);
            if (exists) throw new UserAlreadyExistsException();

            const userType = await this.userTypeRepo.findById(command.userTypeId);
            if (!userType) throw new UserTypeNotFoundException();

            const userId = v4() as UUID;

            const user = await User.createFromRegistration(
                userId,
                UserTypeData.create(command.userTypeId, userType.typeName, userType.role),
                command.username,
                command.email,
                command.password,
                undefined,
                false,
                0,
            );

            await this.userRepo.save(user);

            const verification = EmailVerification.create(
                v4() as UUID,
                user.id,
                user.email,
                EmailVerificationPurpose.REGISTRATION,
                new Date(Date.now() + EMAIL_VERIFICATION_TTL),
            );

            await this.emailVerificationRepo.save(verification);

            await this.emailService.sendEmailVerification({
                to: verification.email,
                token: verification.id,
                purpose: verification.purpose,
            });

            return user.id;
        });
    }
}
