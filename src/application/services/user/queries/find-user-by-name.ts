import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { UserDTO, IUserReader } from '@application/readers/user';

import { UserNotFoundException } from '../exceptions';

export class FindUserByName {
    constructor(readonly username: string) {}
}

export class FindUserByNameHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(query: FindUserByName): Promise<Result<UserDTO, ApplicationException>> {
        return safeAsync(async () => {
            const user = await this.userReader.findByUsername(query.username);
            if (!user) throw new UserNotFoundException();
            return user;
        });
    }
}
