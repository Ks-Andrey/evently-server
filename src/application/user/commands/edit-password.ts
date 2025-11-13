import { NotFoundError } from '@domain/common';
import { IUserRepository, PasswordNotVerified } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class EditUserPassword {
    constructor(
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
            if (!user) throw new NotFoundError();
            if (!user.validPassword(command.oldPassword)) throw new PasswordNotVerified();

            user.changePassword(command.newPassword);

            await this.userRepo.save(user);

            return user.id;
        });
    }
}
