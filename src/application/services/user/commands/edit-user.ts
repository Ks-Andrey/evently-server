import { UUID } from 'crypto';

import { Result } from 'true-myth';

import { safeAsync, NotFoundException, AccessDeniedException } from '@application/services/common';
import { Roles } from '@common/config/roles';
import { IUserRepository } from '@domain/user';

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

    execute(command: EditUser): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();
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
