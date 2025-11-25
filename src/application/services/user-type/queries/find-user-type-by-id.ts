import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { NotFoundException } from '@application/common/exceptions';
import { UserTypeDTO, IUserTypeReader } from '@application/readers/user-type';

export class FindUserTypeById {
    constructor(readonly userTypeId: UUID) {}
}

export class FindUserTypeByIdHandler {
    constructor(private readonly userTypeReader: IUserTypeReader) {}

    execute(query: FindUserTypeById): Promise<Result<UserTypeDTO, Error>> {
        return safeAsync(async () => {
            const userType = await this.userTypeReader.findById(query.userTypeId);
            if (!userType) throw new NotFoundException();

            return userType;
        });
    }
}
