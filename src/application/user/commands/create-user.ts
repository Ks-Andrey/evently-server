import { NotFoundError } from '@domain/common';
import { IUserRepository, IUserTypeRepository, User, UserAlreadyExists } from '@domain/user';
import { Result } from 'true-myth';

import { v4 } from 'uuid';

import { UUID } from 'crypto';

import { safeAsync } from '../../common';

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
    ) {}

    execute(command: CreateUser): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const exists = await this.userRepo.findByEmail(command.email);
            if (exists) throw new UserAlreadyExists();

            const userType = await this.userTypeRepo.findById(command.userTypeId);
            if (!userType) throw new NotFoundError();

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

            return user.id;
        });
    }
}
