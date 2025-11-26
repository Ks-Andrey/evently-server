import { UUID } from 'crypto';
import { Result } from 'true-myth';
import { v4 } from 'uuid';

import { ApplicationException, safeAsync } from '@application/common';
import { IUserTypeReader } from '@application/readers/user-type';
import { Roles } from '@common/constants/roles';
import { UserType, IUserTypeRepository } from '@domain/models/user-type';

import { UserTypeAlreadyExistsException } from '../exceptions';

export class CreateUserType {
    constructor(
        readonly typeName: string,
        readonly role: Roles = Roles.USER,
    ) {}
}

export class CreateUserTypeHandler {
    constructor(
        private readonly userTypeReader: IUserTypeReader,
        private readonly userTypeRepo: IUserTypeRepository,
    ) {}

    execute(command: CreateUserType): Promise<Result<UUID, ApplicationException>> {
        return safeAsync(async () => {
            const existing = await this.userTypeReader.findByName(command.typeName.trim());
            if (existing) throw new UserTypeAlreadyExistsException();

            const userType = UserType.create(v4() as UUID, command.typeName, command.role);
            await this.userTypeRepo.save(userType);

            return userType.userTypeId;
        });
    }
}
