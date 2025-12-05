import { UUID } from 'crypto';

import { PaginationParams, PaginationResult, createPaginationResult } from '@application/common';
import { IUserReader, UserDTO, UserEventDTO, UserListView, UserTypeDTO } from '@application/readers/user';
import { Prisma } from '@prisma/client';

import { prisma } from '../utils';

type UserWithType = Prisma.UserGetPayload<{
    include: { userType: true };
}>;

export class UserReader implements IUserReader {
    async findUserEvents(
        userId: UUID,
        pagination?: PaginationParams,
        search?: string,
    ): Promise<PaginationResult<UserEventDTO>> {
        const page = pagination?.page ?? 1;
        const pageSize = pagination?.pageSize ?? 10;
        const skip = (page - 1) * pageSize;

        const where: Prisma.EventSubscriptionWhereInput = {
            userId,
            ...(search && {
                event: {
                    title: { contains: search, mode: 'insensitive' },
                },
            }),
        };

        const [subscriptions, total] = await Promise.all([
            prisma.eventSubscription.findMany({
                where,
                include: {
                    event: true,
                },
                skip,
                take: pageSize,
            }),
            prisma.eventSubscription.count({ where }),
        ]);

        const data = subscriptions.map((sub) =>
            UserEventDTO.create(sub.event.id as UUID, sub.event.title, sub.event.subscriberCount),
        );

        return createPaginationResult(data, total, page, pageSize);
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

    async findAllViews(pagination: PaginationParams, search?: string): Promise<PaginationResult<UserListView>> {
        const page = pagination.page;
        const pageSize = pagination.pageSize;
        const skip = (page - 1) * pageSize;

        const where: Prisma.UserWhereInput = {
            ...(search && {
                OR: [
                    { username: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [usersData, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: { userType: true },
                skip,
                take: pageSize,
                orderBy: { username: 'asc' },
            }),
            prisma.user.count({ where }),
        ]);

        const data = usersData.map((userData) => this.toUserListView(userData));

        return createPaginationResult(data, total, page, pageSize);
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
            userData.isBlocked,
            userData.telegramId ?? undefined,
            userData.personalData ?? undefined,
            userData.pendingEmail ?? undefined,
            userData.imageUrl ?? undefined,
        );
    }

    private toUserListView(userData: UserWithType): UserListView {
        return UserListView.create(
            userData.id as UUID,
            userData.username,
            userData.email,
            userData.userType.typeName,
            userData.subscriptionCount,
            userData.isBlocked,
            userData.imageUrl ?? undefined,
        );
    }
}
