import { UUID } from 'crypto';

import { BotSendMessageException } from '@application/services/notification';
import { IBotManager } from '@application/services/notification';
import { getErrorMessage } from '@common/utils/error';
import { log } from '@common/utils/logger';

import { bot } from '../utils';

export class BotManager implements IBotManager {
    async sendMessage(userId: UUID, message: string): Promise<void> {
        try {
            await bot.sendMessage(userId, message);
            log.info('Telegram message sent', { userId });
        } catch (error: unknown) {
            log.error('Error sending Telegram message', {
                userId,
                error: log.formatError(error),
            });

            throw new BotSendMessageException({
                userId,
                error: getErrorMessage(error),
            });
        }
    }
}
