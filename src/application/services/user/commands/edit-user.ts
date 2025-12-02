import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, ApplicationException } from '@application/common';
import { Roles } from '@common/constants/roles';
import { IUserRepository } from '@domain/identity/user';

import { UserNotFoundException } from '../exceptions';

export class EditUser {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly username?: string,
        readonly personalData?: string,
    ) {}
}

export class EditUserHandler {
    constructor(readonly userRepo: IUserRepository) {}

    execute(command: EditUser): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();
            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            command.personalData && user.changeUserData(command.personalData);
            command.username && user.changeUsername(command.username);

            await this.userRepo.save(user);

            return user.id;
        });
    }
}
