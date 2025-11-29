import { UUID } from 'crypto';

import { INotificationRepository } from '@domain/models/notification';
import { Notification, NotificationType } from '@domain/models/notification';
import { NotificationUser } from '@domain/models/notification/entities/notification-user';
import { Prisma } from '@generated/prisma/client';

import { PrismaUnitOfWork } from '../database/unit-of-work';

type NotificationWithUser = Prisma.NotificationGetPayload<{
    include: { user: true };
}>;

export class NotificationRepository implements INotificationRepository {
    constructor(private readonly unitOfWork: PrismaUnitOfWork) {}

    private get prisma() {
        return this.unitOfWork.getClient();
    }

    async findById(id: UUID): Promise<Notification | null> {
        const notificationData = await this.prisma.notification.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!notificationData) {
            return null;
        }

        return this.toDomain(notificationData);
    }

    async save(entity: Notification): Promise<void> {
        const user = entity.user;
        const notificationData = {
            id: entity.id,
            eventId: entity.eventId,
            userId: user.id,
            type: entity.type,
            message: entity.message,
            createdAt: entity.createdAt,
        };

        await this.prisma.notification.upsert({
            where: { id: entity.id },
            create: notificationData,
            update: notificationData,
        });
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.notification.delete({
            where: { id },
        });
    }

    private toDomain(notificationData: NotificationWithUser): Notification {
        const user = NotificationUser.create(notificationData.user.id as UUID, notificationData.user.username);
        return Notification.create(
            notificationData.id as UUID,
            notificationData.eventId as UUID,
            user,
            notificationData.message,
            notificationData.type as NotificationType,
            notificationData.createdAt,
        );
    }
}
