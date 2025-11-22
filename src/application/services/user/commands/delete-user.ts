import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { safeAsync, NotFoundException, AccessDeniedException } from '@application/services/common';
import { Roles } from '@common/config/roles';
import { IUserRepository } from '@domain/user';

export class DeleteUser {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
    ) {}
}

export class DeleteUserHandler {
    constructor(readonly userRepo: IUserRepository) {}

    execute(command: DeleteUser): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();
            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            await this.userRepo.delete(user.id);

            return user.id;
        });
    }
}
