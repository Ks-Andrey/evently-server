import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { NotFoundException } from '@application/common/exceptions';
import { UserDTO, IUserReader } from '@application/readers/user';

export class FindUserByName {
    constructor(readonly username: string) {}
}

export class FindUserByNameHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(query: FindUserByName): Promise<Result<UserDTO, Error>> {
        return safeAsync(async () => {
            const user = await this.userReader.findByUsername(query.username);
            if (!user) throw new NotFoundException();
            return user;
        });
    }
}
