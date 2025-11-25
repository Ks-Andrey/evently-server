import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { safeAsync } from '@application/common';
import { EmailVerification, EmailVerificationPurpose, IEmailVerificationRepository } from '@domain/models/auth';
import { IUserRepository, User, UserType } from '@domain/models/user';
import { IUserTypeRepository } from '@domain/models/user-type';

import { EMAIL_VERIFICATION_TTL_HOURS } from '../constants';
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
    ) {}

    execute(command: CreateUser): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const exists = await this.userRepo.findByEmail(command.email);
            if (exists) throw new UserAlreadyExistsException();

            const userType = await this.userTypeRepo.findById(command.userTypeId);
            if (!userType) throw new UserTypeNotFoundException();

            const userId = v4() as UUID;

            const user = await User.create(
                userId,
                UserType.create(command.userTypeId, userType.typeName),
                command.username,
                command.email,
                command.password,
                '',
                false,
                0,
            );

            await this.userRepo.save(user);

            const verification = EmailVerification.create(
                v4() as UUID,
                user.id,
                user.email,
                EmailVerificationPurpose.REGISTRATION,
                new Date(Date.now() + EMAIL_VERIFICATION_TTL_HOURS * 60 * 60 * 1000),
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
