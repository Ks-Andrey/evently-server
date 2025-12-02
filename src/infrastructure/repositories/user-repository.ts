import { UUID } from 'crypto';

import { IUnitOfWork } from '@common/types/unit-of-work';
import { IUserRepository, User, UserTypeData } from '@domain/identity/user';
import { Prisma } from '@generated/prisma/client';

type UserWithType = Prisma.UserGetPayload<{
    include: { userType: true };
}>;

export class UserRepository implements IUserRepository {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    async findById(id: UUID): Promise<User | null> {
        const client = this.unitOfWork.getClient();
        const userData = await client.user.findUnique({
            where: { id },
            include: { userType: true },
        });

        if (!userData) {
            return null;
        }

        return this.toDomain(userData);
    }

    async findByEmail(email: string): Promise<User | null> {
        const client = this.unitOfWork.getClient();
        const userData = await client.user.findUnique({
            where: { email },
            include: { userType: true },
        });

        if (!userData) {
            return null;
        }

        return this.toDomain(userData);
    }

    async save(entity: User): Promise<void> {
        const client = this.unitOfWork.getClient();
        const userData = {
            id: entity.id,
            userTypeId: entity.userType.userTypeId,
            username: entity.username,
            email: entity.email,
            emailVerified: entity.isEmailVerified,
            passwordHash: entity.passwordHash,
            subscriptionCount: entity.subscriptionCount,
            personalData: entity.personalData,
            isBlocked: entity.isBlocked,
            pendingEmail: entity.pendingEmail,
            imageUrl: entity.imageUrl,
        };

        await client.user.upsert({
            where: { id: entity.id },
            create: userData,
            update: userData,
        });
    }

    async delete(id: UUID): Promise<void> {
        const client = this.unitOfWork.getClient();
        await client.user.delete({
            where: { id },
        });
    }

    private toDomain(userData: UserWithType): User {
        const userType = UserTypeData.create(
            userData.userType?.userTypeId as UUID,
            userData.userType?.typeName,
            userData.userType.role,
        );

        return User.createFromDatabase(
            userData.id as UUID,
            userType,
            userData.username,
            userData.email,
            userData.passwordHash,
            userData.personalData ?? undefined,
            userData.isBlocked,
            userData.subscriptionCount,
            userData.emailVerified,
            userData.pendingEmail ?? undefined,
            userData.imageUrl ?? undefined,
        );
    }
}
