import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { IUserReader, UserDTO } from '@application/readers/user';

import { UserNotFoundException } from '../exceptions';

export class FindUserById {
    constructor(readonly userId: UUID) {}
}

export class FindUserByIdHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(query: FindUserById): Promise<Result<UserDTO, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userReader.findById(query.userId);
            if (!user) throw new UserNotFoundException();
            return user;
        });
    }
}
