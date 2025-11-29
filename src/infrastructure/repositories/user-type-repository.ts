import { UUID } from 'crypto';

import { Roles } from '@common/constants/roles';
import { IUserTypeRepository } from '@domain/models/user-type';
import { UserType } from '@domain/models/user-type';
import { Prisma } from '@generated/prisma/client';

import { PrismaUnitOfWork } from '../database/unit-of-work';

type UserTypeData = Prisma.UserTypeGetPayload<{}>;

export class UserTypeRepository implements IUserTypeRepository {
    constructor(private readonly unitOfWork: PrismaUnitOfWork) {}

    private get prisma() {
        return this.unitOfWork.getClient();
    }

    async findById(id: UUID): Promise<UserType | null> {
        const userTypeData = await this.prisma.userType.findUnique({
            where: { userTypeId: id },
        });

        if (!userTypeData) {
            return null;
        }

        return this.toDomain(userTypeData);
    }

    async findByName(name: string): Promise<UserType | null> {
        const userTypeData = await this.prisma.userType.findUnique({
            where: { typeName: name },
        });

        if (!userTypeData) {
            return null;
        }

        return this.toDomain(userTypeData);
    }

    async save(entity: UserType): Promise<void> {
        const userTypeData = {
            userTypeId: entity.userTypeId,
            typeName: entity.typeName,
            role: entity.role,
        };

        await this.prisma.userType.upsert({
            where: { userTypeId: entity.userTypeId },
            create: userTypeData,
            update: userTypeData,
        });
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.userType.delete({
            where: { userTypeId: id },
        });
    }

    private toDomain(userTypeData: UserTypeData): UserType {
        return UserType.create(userTypeData.userTypeId as UUID, userTypeData.typeName, userTypeData.role as Roles);
    }
}
