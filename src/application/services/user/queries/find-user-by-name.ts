import { Result } from 'true-myth';

import { UserDTO, IUserReader } from '@application/queries/user';
import { safeAsync, NotFoundException } from '@application/services/common';

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
