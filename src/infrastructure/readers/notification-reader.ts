import { UUID } from 'crypto';

import { PaginationParams, PaginationResult, createPaginationResult } from '@application/common';
import { INotificationReader, NotificationDTO, NotificationUserDTO } from '@application/readers/notification';
import { UPLOAD_DIRECTORIES } from '@common/constants/file-upload';
import { getImageUrl } from '@common/utils/image-url';
import { Prisma } from '@prisma/client';

import { prisma } from '../utils';

type NotificationWithUser = Prisma.NotificationGetPayload<{
    include: { user: true };
}>;

export class NotificationReader implements INotificationReader {
    async findByUserId(
        userId: UUID,
        pagination: PaginationParams,
        dateFrom?: Date,
        dateTo?: Date,
    ): Promise<PaginationResult<NotificationDTO>> {
        const page = pagination.page;
        const pageSize = pagination.pageSize;
        const skip = (page - 1) * pageSize;

        const where: Prisma.NotificationWhereInput = {
            userId,
            ...(dateFrom || dateTo
                ? {
                      createdAt: {
                          ...(dateFrom ? { gte: dateFrom } : {}),
                          ...(dateTo ? { lte: dateTo } : {}),
                      },
                  }
                : {}),
        };

        const [notificationsData, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                include: { user: true },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.notification.count({ where }),
        ]);

        const data = notificationsData.map((notificationData) => this.toNotificationDTO(notificationData));

        return createPaginationResult(data, total, page, pageSize);
    }

    private toNotificationDTO(notificationData: NotificationWithUser): NotificationDTO {
        const userDTO = NotificationUserDTO.create(
            notificationData.user.id as UUID,
            notificationData.user.username,
            notificationData.user.imageUrl
                ? getImageUrl(notificationData.user.imageUrl, UPLOAD_DIRECTORIES.AVATARS)
                : undefined,
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
