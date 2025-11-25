import { UUID } from 'crypto';
import { Result } from 'true-myth';

import { safeAsync } from '@application/common';
import { Roles } from '@common/config/roles';
import { IUserTypeRepository } from '@domain/models/user-type';

import { UserTypeNotFoundException } from '../exceptions';

export class EditUserType {
    constructor(
        readonly userTypeId: UUID,
        readonly typeName?: string,
        readonly role?: Roles,
    ) {}
}

export class EditUserTypeHandler {
    constructor(private readonly userTypeRepo: IUserTypeRepository) {}

    execute(command: EditUserType): Promise<Result<UUID, Error>> {
        return safeAsync(async () => {
            const userType = await this.userTypeRepo.findById(command.userTypeId);
            if (!userType) throw new UserTypeNotFoundException();

            if (command.typeName !== undefined) {
                userType.updateName(command.typeName);
            }

            if (command.role !== undefined) {
                userType.updateRole(command.role);
            }

            await this.userTypeRepo.save(userType);

            return userType.userTypeId;
        });
    }
}
