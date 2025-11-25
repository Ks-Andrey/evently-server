import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { NotFoundException } from '@application/common/exceptions';
import { IUserReader, UserDTO } from '@application/readers/user';

export class FindUserByEmail {
    constructor(readonly email: string) {}
}

export class FindUserByEmailHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(query: FindUserByEmail): Promise<Result<UserDTO, Error>> {
        return safeAsync(async () => {
            const user = await this.userReader.findByUsername(query.email);
            if (!user) throw new NotFoundException();
            return user;
        });
    }
}
