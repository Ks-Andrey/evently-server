import { UUID } from 'crypto';

import { IUserReader } from '@application/readers/user';
import { UserDTO } from '@application/readers/user/dto/user-dto';
import { UserEventDTO } from '@application/readers/user/dto/user-event-dto';
import { UserTypeDTO } from '@application/readers/user-type/dto/user-type-dto';
import { Roles } from '@common/constants/roles';
import { Prisma } from '@generated/prisma/client';

import { prisma } from '../utils/database/prisma-client';

type UserWithType = Prisma.UserGetPayload<{
    include: { userType: true };
}>;

type EventSubscriptionWithEvent = Prisma.EventSubscriptionGetPayload<{
    include: { event: true };
}>;

export class UserReader implements IUserReader {
    async findUserEvents(userId: UUID): Promise<UserEventDTO[]> {
        const subscriptions = await prisma.eventSubscription.findMany({
            where: { userId },
            include: {
                event: true,
            },
        });

        return (subscriptions as EventSubscriptionWithEvent[]).map((sub) =>
            UserEventDTO.create(sub.event.id as UUID, sub.event.title, sub.event.subscriberCount),
        );
    }

    async findByUsername(username: string): Promise<UserDTO | null> {
        const userData = await prisma.user.findUnique({
            where: { username },
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

        return (usersData as UserWithType[]).map((userData) => this.toUserDTO(userData));
    }

    private toUserDTO(userData: UserWithType): UserDTO {
        const userTypeDTO = UserTypeDTO.create(
            userData.userType.userTypeId as UUID,
            userData.userType.typeName,
            userData.userType.role as Roles,
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
