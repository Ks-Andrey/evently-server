import { UUID } from 'crypto';

import { IUserReader, UserDTO, UserEventDTO, UserTypeDTO } from '@application/readers/user';
import { Prisma } from '@prisma/client';

import { prisma } from '../utils';

type UserWithType = Prisma.UserGetPayload<{
    include: { userType: true };
}>;

export class UserReader implements IUserReader {
    async findUserEvents(userId: UUID): Promise<UserEventDTO[]> {
        const subscriptions = await prisma.eventSubscription.findMany({
            where: { userId },
            include: {
                event: true,
            },
        });

        return subscriptions.map((sub) =>
            UserEventDTO.create(sub.event.id as UUID, sub.event.title, sub.event.subscriberCount),
        );
    }

    async findByUsername(username: string): Promise<UserDTO | null> {
        const normalizedUsername = username.trim();
        const userData = await prisma.user.findFirst({
            where: { username: { equals: normalizedUsername, mode: 'insensitive' } },
            include: { userType: true },
        });

        if (!userData) {
            return null;
        }

        return this.toUserDTO(userData);
    }

    async findById(userId: UUID): Promise<UserDTO | null> {
        const userData = await prisma.user.findUnique({
            where: { id: userId },
            include: { userType: true },
        });

        if (!userData) {
            return null;
        }

        return this.toUserDTO(userData);
    }

    async findAll(): Promise<UserDTO[]> {
        const usersData = await prisma.user.findMany({
            include: { userType: true },
        });

        return usersData.map((userData) => this.toUserDTO(userData));
    }

    private toUserDTO(userData: UserWithType): UserDTO {
        const userTypeDTO = UserTypeDTO.create(
            userData.userType.userTypeId as UUID,
            userData.userType.typeName,
            userData.userType.role,
        );

        return UserDTO.create(
            userData.id as UUID,
            userTypeDTO,
            userData.username,
            userData.email,
            userData.emailVerified,
            userData.passwordHash,
            userData.subscriptionCount,
            userData.personalData || undefined,
            userData.isBlocked,
            userData.pendingEmail || undefined,
            userData.imageUrl || undefined,
        );
    }
}
