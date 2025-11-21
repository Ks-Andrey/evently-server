import { NotFoundException } from '@domain/common';

import { Result } from 'true-myth';

import { safeAsync } from '../../common';
import { UserDTO } from '../dto/user-dto';
import { IUserReader } from '../interfaces/user-reader';

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
