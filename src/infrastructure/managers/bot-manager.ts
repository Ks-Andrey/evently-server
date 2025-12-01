import { UUID } from 'crypto';

import { IBotManager } from '@application/services/notification';
import { log } from '@common/utils/logger';

import { bot } from '../utils';

export class BotManager implements IBotManager {
    async sendMessage(userId: UUID, message: string): Promise<void> {
        await bot.sendMessage(userId, message);

        log.info('Email verification sent');
    }
}
