import { UUID } from 'crypto';

import { Notification, INotificationRepository, NotificationUser } from '@domain/social/notification';
import { Prisma } from '@generated/prisma/client';

import { prisma } from '../utils';

type NotificationWithUser = Prisma.NotificationGetPayload<{
    include: { user: true };
}>;

export class NotificationRepository implements INotificationRepository {
    async findById(id: UUID): Promise<Notification | null> {
        const notificationData = await prisma.notification.findUnique({
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

        await prisma.notification.upsert({
            where: { id: entity.id },
            create: notificationData,
            update: notificationData,
        });
    }

    async delete(id: UUID): Promise<void> {
        await prisma.notification.delete({
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
            notificationData.type,
            notificationData.createdAt,
        );
    }
}
