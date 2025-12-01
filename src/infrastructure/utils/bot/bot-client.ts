import TelegramBot from 'node-telegram-bot-api';

import { BOT_TOKEN } from '@common/config/bot';
import { log } from '@common/utils/logger';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on('polling_error', (error) => {
    log.error('Telegram client error', { error });
});

export { bot };
