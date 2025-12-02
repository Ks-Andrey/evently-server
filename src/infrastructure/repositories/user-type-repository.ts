import { UUID } from 'crypto';

import { IUnitOfWork } from '@common/types/unit-of-work';
import { UserType, IUserTypeRepository } from '@domain/identity/user-type';
import { Prisma } from '@generated/prisma/client';

type UserTypeData = Prisma.UserTypeGetPayload<{}>;

export class UserTypeRepository implements IUserTypeRepository {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    async findById(id: UUID): Promise<UserType | null> {
        const client = this.unitOfWork.getClient();
        const userTypeData = await client.userType.findUnique({
            where: { userTypeId: id },
        });

        if (!userTypeData) {
            return null;
        }

        return this.toDomain(userTypeData);
    }

    async findByName(name: string): Promise<UserType | null> {
        const client = this.unitOfWork.getClient();
        const userTypeData = await client.userType.findUnique({
            where: { typeName: name },
        });

        if (!userTypeData) {
            return null;
        }

        return this.toDomain(userTypeData);
    }

    async save(entity: UserType): Promise<void> {
        const client = this.unitOfWork.getClient();
        const userTypeData = {
            userTypeId: entity.userTypeId,
            typeName: entity.typeName,
            role: entity.role,
        };

        await client.userType.upsert({
            where: { userTypeId: entity.userTypeId },
            create: userTypeData,
            update: userTypeData,
        });
    }

    async delete(id: UUID): Promise<void> {
        const client = this.unitOfWork.getClient();
        await client.userType.delete({
            where: { userTypeId: id },
        });
    }

    private toDomain(userTypeData: UserTypeData): UserType {
        return UserType.create(userTypeData.userTypeId as UUID, userTypeData.typeName, userTypeData.role);
    }
}
