import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { AccessDeniedException, ApplicationException, executeInTransaction } from '@application/common';
import { IS_DEV_MODE } from '@common/config/app';
import { EMAIL_VERIFICATION_TTL } from '@common/constants/email-verification';
import { Roles } from '@common/constants/roles';
import { IUnitOfWork } from '@common/types/unit-of-work';
import { log } from '@common/utils/logger';
import { EmailVerification, EmailVerificationPurpose, IEmailVerificationRepository } from '@domain/identity/auth';
import { IUserRepository, User, UserTypeData } from '@domain/identity/user';
import { IUserTypeRepository } from '@domain/identity/user-type';

import { CreateUserResult } from '../dto/create-user-result';
import { UserAlreadyExistsException, UserTypeNotFoundException } from '../exceptions';
import { IEmailManager } from '../interfaces/email-manager';

export class CreateUser {
    constructor(
        readonly userTypeId: UUID,
        readonly username: string,
        readonly email: string,
        readonly password: string,
        readonly telegramId?: string,
        readonly currentUserRole?: Roles,
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

    execute(command: CreateUser): Promise<Result<CreateUserResult, ApplicationException>> {
        return executeInTransaction(this.unitOfWork, async () => {
            const exists = await this.userRepo.findByEmail(command.email.trim());
            if (exists) throw new UserAlreadyExistsException();

            const userType = await this.userTypeRepo.findById(command.userTypeId);
            if (!userType) throw new UserTypeNotFoundException();

            // Проверка прав на создание администратора
            if (userType.role === Roles.ADMIN && command.currentUserRole !== Roles.ADMIN) {
                throw new AccessDeniedException();
            }

            const userId = v4() as UUID;

            const user = await User.createFromRegistration(
                userId,
                UserTypeData.create(command.userTypeId, userType.typeName, userType.role),
                command.username,
                command.email.trim(),
                command.password,
                false,
                0,
                false,
                command.telegramId?.trim(),
            );

            if (IS_DEV_MODE) {
                user.markEmailVerified();
                log.debug('Email auto-verified in dev mode', { userId: user.id, email: user.email });
            } else {
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
            }

            await this.userRepo.save(user);

            return CreateUserResult.create(user.id);
        });
    }
}
