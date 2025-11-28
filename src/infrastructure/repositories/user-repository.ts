import { Prisma } from '@generated/prisma/client';
import { UUID } from 'crypto';

import { IUserRepository, User, UserType } from '@domain/models/user';

import { PrismaUnitOfWork } from '../database/unit-of-work';

type UserWithType = Prisma.UserGetPayload<{
    include: { userType: true };
}>;

export class UserRepository implements IUserRepository {
    constructor(private readonly unitOfWork: PrismaUnitOfWork) {}

    private get prisma() {
        return this.unitOfWork.getClient();
    }

    async findById(id: UUID): Promise<User | null> {
        const userData = await this.prisma.user.findUnique({
            where: { id },
            include: { userType: true },
        });

        if (!userData) {
            return null;
        }

        return this.toDomain(userData);
    }

    async findByEmail(email: string): Promise<User | null> {
        const userData = await this.prisma.user.findUnique({
            where: { email },
            include: { userType: true },
        });

        if (!userData) {
            return null;
        }

        return this.toDomain(userData);
    }

    async save(entity: User): Promise<void> {
        const userType = entity.userType;
        // Access private fields using type assertion
        interface UserPrivate {
            _passwordHash: string;
            _pendingEmail?: string;
            _imageUrl?: string;
        }
        const userPrivate = entity as unknown as UserPrivate;

        const userData = {
            id: entity.id,
            userTypeId: userType.userTypeId,
            username: entity.username,
            email: entity.email,
            emailVerified: entity.isEmailVerified,
            passwordHash: userPrivate._passwordHash,
            subscriptionCount: entity.subscriptionCount,
            personalData: entity.personalData,
            isBlocked: entity.isBlocked,
            pendingEmail: userPrivate._pendingEmail,
            imageUrl: userPrivate._imageUrl,
        };

        await this.prisma.user.upsert({
            where: { id: entity.id },
            create: userData,
            update: userData,
        });
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }

    private toDomain(userData: UserWithType): User {
        const userType = UserType.create(userData.userType?.userTypeId as UUID, userData.userType?.typeName);

        return User.createSync(
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
