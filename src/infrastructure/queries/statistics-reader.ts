import { SystemStatisticsDTO, IStatisticsReader } from '@application/readers/statistics';
import { Roles } from '@common/constants/roles';

import { EventStatisticsDTO } from '../../application/readers/statistics/dto/event-statistics-dto';
import { UserStatisticsDTO } from '../../application/readers/statistics/dto/user-statistics-dto';
import { prisma } from '../utils';

export class StatisticsReader implements IStatisticsReader {
    async getUserStatistics(): Promise<UserStatisticsDTO> {
        const [total, usersByRole, active, blocked, withTelegram, emailVerified] = await Promise.all([
            prisma.user.count(),
            prisma.user.groupBy({
                by: ['userTypeId'],
                _count: true,
            }),
            prisma.user.count({
                where: { isBlocked: false },
            }),
            prisma.user.count({
                where: { isBlocked: true },
            }),
            prisma.user.count({
                where: { telegramId: { not: null } },
            }),
            prisma.user.count({
                where: { emailVerified: true },
            }),
        ]);

        const userTypes = await prisma.userType.findMany({
            where: {
                userTypeId: {
                    in: usersByRole.map((g) => g.userTypeId),
                },
            },
        });

        const roleMap = new Map(userTypes.map((ut) => [ut.userTypeId, ut.role]));

        let adminCount = 0;
        let organizerCount = 0;
        let userCount = 0;

        usersByRole.forEach((group) => {
            const role = roleMap.get(group.userTypeId);
            const count = group._count;
            if (role === Roles.ADMIN) {
                adminCount = count;
            } else if (role === Roles.ORGANIZER) {
                organizerCount = count;
            } else if (role === Roles.USER) {
                userCount = count;
            }
        });

        return UserStatisticsDTO.create(
            total,
            {
                admin: adminCount,
                organizer: organizerCount,
                user: userCount,
            },
            active,
            blocked,
            withTelegram,
            emailVerified,
        );
    }

    async getEventStatistics(): Promise<EventStatisticsDTO> {
        const now = new Date();

        const [total, active, upcoming, past, eventsByCategory, totalSubscriptions, totalComments] = await Promise.all([
            prisma.event.count(),
            prisma.event.count({
                where: {
                    date: { gte: now },
                },
            }),
            prisma.event.count({
                where: {
                    date: { gte: now },
                },
            }),
            prisma.event.count({
                where: {
                    date: { lt: now },
                },
            }),
            prisma.event.groupBy({
                by: ['categoryId'],
                _count: true,
            }),
            prisma.eventSubscription.count(),
            prisma.comment.count(),
        ]);

        const categories = await prisma.category.findMany({
            where: {
                categoryId: {
                    in: eventsByCategory.map((g) => g.categoryId),
                },
            },
        });

        const categoryMap = new Map(categories.map((c) => [c.categoryId, c.categoryName]));

        const byCategory = eventsByCategory.map((group) => ({
            categoryId: group.categoryId,
            categoryName: categoryMap.get(group.categoryId) || 'Unknown',
            count: group._count,
        }));

        return EventStatisticsDTO.create(total, active, upcoming, past, byCategory, totalSubscriptions, totalComments);
    }

    async getSystemStatistics(): Promise<SystemStatisticsDTO> {
        const [users, events, categories, comments, notifications] = await Promise.all([
            this.getUserStatistics(),
            this.getEventStatistics(),
            prisma.category.count(),
            prisma.comment.count(),
            prisma.notification.count(),
        ]);

        return SystemStatisticsDTO.create(users, events, categories, comments, notifications);
    }
}
