import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, ApplicationException } from '@application/common';
import { Roles } from '@common/constants/roles';
import { IUserRepository } from '@domain/identity/user';

import { EditUserResult } from '../dto/edit-user-result';
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

    execute(command: EditUser): Promise<Result<EditUserResult, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();
            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            if (command.personalData !== undefined) {
                user.changeUserData(command.personalData);
            }
            if (command.username !== undefined) {
                user.changeUsername(command.username);
            }

            await this.userRepo.save(user);

            return EditUserResult.create(user.id);
        });
    }
}
