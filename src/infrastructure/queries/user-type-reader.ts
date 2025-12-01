import { UUID } from 'crypto';

import { IUserTypeReader } from '@application/readers/user-type';
import { UserTypeDTO } from '@application/readers/user-type/dto/user-type-dto';
import { Roles } from '@common/constants/roles';
import { Prisma } from '@generated/prisma/client';

import { prisma } from '../utils/database/prisma-client';

type UserTypeData = Prisma.UserTypeGetPayload<{}>;

export class UserTypeReader implements IUserTypeReader {
    async findAll(): Promise<UserTypeDTO[]> {
        const userTypesData = await prisma.userType.findMany();

        return userTypesData.map((userTypeData) => this.toUserTypeDTO(userTypeData));
    }

    async findById(userTypeId: UUID): Promise<UserTypeDTO | null> {
        const userTypeData = await prisma.userType.findUnique({
            where: { userTypeId },
        });

        if (!userTypeData) {
            return null;
        }

        return this.toUserTypeDTO(userTypeData);
    }

    async findByName(name: string): Promise<UserTypeDTO | null> {
        const userTypeData = await prisma.userType.findUnique({
            where: { typeName: name },
        });

        if (!userTypeData) {
            return null;
        }

        return this.toUserTypeDTO(userTypeData);
    }

    private toUserTypeDTO(userTypeData: UserTypeData): UserTypeDTO {
        return UserTypeDTO.create(userTypeData.userTypeId as UUID, userTypeData.typeName, userTypeData.role as Roles);
    }
}
