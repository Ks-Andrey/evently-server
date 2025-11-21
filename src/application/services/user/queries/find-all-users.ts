import { Result } from 'true-myth';

import { safeAsync } from '../../common';

import { UserDTO } from '../dto/user-dto';
import { IUserReader } from '../interfaces/user-reader';

export class FindAllUsersHandler {
    constructor(readonly userReader: IUserReader) {}

    async execute(): Promise<Result<UserDTO[], Error>> {
        return safeAsync(async () => {
            return await this.userReader.findAll();
        });
    }
}
