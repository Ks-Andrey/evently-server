import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { NotFoundException, AccessDeniedException } from '@application/common/exceptions';
import { Roles } from '@common/config/roles';
import { IUserRepository } from '@domain/models/user';

export class EditUserPassword {
    constructor(
        readonly role: Roles,
        readonly userId: UUID,
        readonly oldPassword: string,
        readonly newPassword: string,
    ) {}
}

export class EditUserPasswordHandler {
    constructor(readonly userRepo: IUserRepository) {}

    execute(command: EditUserPassword): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundException();
            if (command.role !== Roles.ADMIN && !user.canEditedBy(command.userId)) {
                throw new AccessDeniedException();
            }

            user.ensureValidPassword(command.oldPassword);
            user.changePassword(command.newPassword);

            await this.userRepo.save(user);

            return user.id;
        });
    }
}
