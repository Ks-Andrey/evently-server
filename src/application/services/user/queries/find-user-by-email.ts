import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { IUserReader, UserDTO } from '@application/readers/user';

import { UserNotFoundException } from '../exceptions';

export class FindUserByEmail {
    constructor(readonly email: string) {}
}

export class FindUserByEmailHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(query: FindUserByEmail): Promise<Result<UserDTO, Error>> {
        return safeAsync(async () => {
            const user = await this.userReader.findByUsername(query.email);
            if (!user) throw new UserNotFoundException();
            return user;
        });
    }
}
