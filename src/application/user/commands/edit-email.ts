import { NotFoundError } from '@domain/common';
import { IUserRepository, PasswordNotVerified } from '@domain/user';
import { Result } from 'true-myth';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

export class EditUserEmail {
    constructor(
        readonly userId: UUID,
        readonly password: string,
        readonly newEmail: string,
    ) {}
}

export class EditUserEmailHandler {
    constructor(readonly userRepo: IUserRepository) {}

    execute(command: EditUserEmail): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const user = await this.userRepo.findById(command.userId);
            if (!user) throw new NotFoundError();
            if (!user.validPassword(command.password)) throw new PasswordNotVerified();

            user.changeEmail(command.newEmail);

            await this.userRepo.save(user);

            return user.id;
        });
    }
}
