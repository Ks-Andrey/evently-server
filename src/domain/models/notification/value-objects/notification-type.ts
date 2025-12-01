import { Enum } from '@common/types/enum';

export const NotificationType = {
    EVENT_UPDATED: 'EVENT_UPDATED',
    EVENT_REMINDER: 'EVENT_REMINDER',
    EVENT_CANCELLED: 'EVENT_CANCELLED',
} as const;
export type NotificationType = Enum<typeof NotificationType>;
