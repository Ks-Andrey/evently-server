import { UUID } from 'crypto';

import { INotificationReader, NotificationDTO, NotificationUserDTO } from '@application/readers/notification';
import { Prisma } from '@generated/prisma/client';

import { prisma } from '../utils';

type NotificationWithUser = Prisma.NotificationGetPayload<{
    include: { user: true };
}>;

export class NotificationReader implements INotificationReader {
    async findByUserId(userId: UUID): Promise<NotificationDTO[]> {
        const notificationsData = await prisma.notification.findMany({
            where: { userId },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });

        return notificationsData.map((notificationData) => this.toNotificationDTO(notificationData));
    }

    private toNotificationDTO(notificationData: NotificationWithUser): NotificationDTO {
        const userDTO = NotificationUserDTO.create(
            notificationData.user.id as UUID,
            notificationData.user.username,
            notificationData.user.imageUrl || undefined,
        );

        return NotificationDTO.create(
            notificationData.id as UUID,
            notificationData.eventId as UUID,
            userDTO,
            notificationData.createdAt,
            notificationData.message,
        );
    }
}
