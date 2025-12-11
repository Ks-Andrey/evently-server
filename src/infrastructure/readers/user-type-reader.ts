import { UUID } from 'crypto';

import { IUserTypeReader, UserTypeDTO } from '@application/readers/user-type';
import { Roles } from '@common/constants/roles';
import { Prisma } from '@prisma/client';

import { prisma } from '../utils';

type UserTypeData = Prisma.UserTypeGetPayload<{}>;

export class UserTypeReader implements IUserTypeReader {
    async findAll(withAdmin: boolean): Promise<UserTypeDTO[]> {
        const where: Prisma.UserTypeWhereInput | undefined = withAdmin
            ? undefined
            : {
                  role: { not: Roles.ADMIN },
              };

        const userTypesData = await prisma.userType.findMany({
            where,
        });

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
        const normalizedName = name.trim();
        const userTypeData = await prisma.userType.findFirst({
            where: { typeName: { equals: normalizedName, mode: 'insensitive' } },
        });

        if (!userTypeData) {
            return null;
        }

        return this.toUserTypeDTO(userTypeData);
    }

    private toUserTypeDTO(userTypeData: UserTypeData): UserTypeDTO {
        return UserTypeDTO.create(userTypeData.userTypeId as UUID, userTypeData.typeName, userTypeData.role);
    }
}
