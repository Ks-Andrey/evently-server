import { NotFoundException } from '@domain/common';

import { Result } from 'true-myth';

import { safeAsync } from '../../common/utils/safe-async';
import { UserDTO } from '../dto/user-dto';
import { IUserReader } from '../interfaces/user-reader';

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
