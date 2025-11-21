import { EMAIL_VERIFICATION_TTL_HOURS } from '@application/services/user/constants';
import { EmailVerification, EmailVerificationPurpose, IEmailVerificationRepository } from '@domain/auth';
import { NotFoundException } from '@domain/common';
import { IUserRepository, IUserTypeRepository, User, UserAlreadyExists } from '@domain/user';
import { Result } from 'true-myth';

import { v4 } from 'uuid';

import { UUID } from 'crypto';

import { IEmailService, safeAsync } from '../../common';

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
        private readonly emailService: IEmailService,
    ) {}

    execute(command: CreateUser): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const exists = await this.userRepo.findByEmail(command.email);
            if (exists) throw new UserAlreadyExists();

            const userType = await this.userTypeRepo.findById(command.userTypeId);
            if (!userType) throw new NotFoundException();

            const userId = v4() as UUID;

            const user = await User.create(
                userId,
                userType,
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
