import { UUID } from 'crypto';

import { IUnitOfWork } from '@common/types/unit-of-work';
import { Notification, INotificationRepository, NotificationUser } from '@domain/social/notification';
import { Prisma } from '@generated/prisma/client';

type NotificationWithUser = Prisma.NotificationGetPayload<{
    include: { user: true };
}>;

export class NotificationRepository implements INotificationRepository {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    async findById(id: UUID): Promise<Notification | null> {
        const client = this.unitOfWork.getClient();
        const notificationData = await client.notification.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!notificationData) {
            return null;
        }

        return this.toDomain(notificationData);
    }

    async save(entity: Notification): Promise<void> {
        const client = this.unitOfWork.getClient();
        const user = entity.user;
        const notificationData = {
            id: entity.id,
            eventId: entity.eventId,
            userId: user.id,
            type: entity.type,
            message: entity.message,
            createdAt: entity.createdAt,
        };

        await client.notification.upsert({
            where: { id: entity.id },
            create: notificationData,
            update: notificationData,
        });
    }

    async delete(id: UUID): Promise<void> {
        const client = this.unitOfWork.getClient();
        await client.notification.delete({
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
