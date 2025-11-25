import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { IUserReader } from '@application/readers/user';
import { IUserTypeRepository } from '@domain/models/user-type';

import { UserTypeNotFoundException, UserTypeInUseException } from '../exceptions';

export class DeleteUserType {
    constructor(readonly userTypeId: UUID) {}
}

export class DeleteUserTypeHandler {
    constructor(
        private readonly userTypeRepo: IUserTypeRepository,
        private readonly userReader: IUserReader,
    ) {}

    execute(command: DeleteUserType): Promise<Result<boolean, ApplicationException>> {
        return safeAsync(async () => {
            const userType = await this.userTypeRepo.findById(command.userTypeId);
            if (!userType) throw new UserTypeNotFoundException();

            const allUsers = await this.userReader.findAll();
            const usersWithThisType = allUsers.filter((user) => user.userType.userTypeId === command.userTypeId);
            if (usersWithThisType.length > 0) {
                throw new UserTypeInUseException();
            }

            await this.userTypeRepo.delete(userType.userTypeId);

            return true;
        });
    }
}
