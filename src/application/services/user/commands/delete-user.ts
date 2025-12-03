import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync, AccessDeniedException, ApplicationException } from '@application/common';
import { Roles } from '@common/constants/roles';
import { IUserRepository } from '@domain/identity/user';

import { DeleteUserResult } from '../dto/delete-user-result';
import { UserNotFoundException } from '../exceptions';

export class DeleteUser {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
    ) {}
}

export class DeleteUserHandler {
    constructor(readonly userRepo: IUserRepository) {}

    execute(command: DeleteUser): Promise<Result<DeleteUserResult, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new UserNotFoundException();
            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            await this.userRepo.delete(user.id);

            return DeleteUserResult.create(user.id);
        });
    }
}
