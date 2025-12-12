import * as cron from 'node-cron';

import { NotifyEventRemindersHandler, NotifyEventReminders } from '@application/services/notification';
import { log } from '@common/utils/logger';

export function startEventReminderCron(notifyEventRemindersHandler: NotifyEventRemindersHandler): void {
    log.info('Starting event reminder cron job...');

    cron.schedule('*/5 * * * *', async () => {
        try {
            log.debug('Running event reminder cron job...');
            const command = new NotifyEventReminders();
            const result = await notifyEventRemindersHandler.execute(command);

            if (result.isOk) {
                const data = result.value;
                if (data.totalNotified > 0) {
                    log.info(`Event reminders sent: ${data.message}`);
                }
            } else {
                log.error('Error in event reminder cron job', { error: result.error });
            }
        } catch (error) {
            log.error('Unexpected error in event reminder cron job', { error });
        }
    });

    log.info('Event reminder cron job started (runs every 5 minutes)');
}
