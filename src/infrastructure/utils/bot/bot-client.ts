import TelegramBot from 'node-telegram-bot-api';

import { FRONTEND_URL } from '@common/config/app';
import { BOT_TOKEN } from '@common/config/bot';
import { MESSAGES } from '@common/constants/messages';
import { log } from '@common/utils/logger';

const bot: TelegramBot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on('polling_error', (error) => {
    log.error('Telegram client error', { error });
});

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: MESSAGES.bot.start.buttonText,
                        web_app: {
                            url: FRONTEND_URL,
                        },
                    },
                ],
            ],
        },
    };

    try {
        await bot.sendMessage(chatId, MESSAGES.bot.start.welcome, keyboard);
        log.info('Start command processed', { chatId, userId: msg.from?.id });
    } catch (error) {
        log.error('Error processing start command', { error, chatId });
    }
});

export { bot };
