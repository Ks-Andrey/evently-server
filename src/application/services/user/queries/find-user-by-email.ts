import { Result } from 'true-myth';

import { IUserReader, UserDTO } from '@application/queries/user';
import { safeAsync, NotFoundException } from '@application/services/common';

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
