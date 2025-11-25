import { ApplicationErrorCodes } from '@application/common/exceptions/error-codes';
import { ApplicationException } from '@application/common/exceptions/exceptions';
import { errorMessages } from '@common/config/errors';

export class NotificationNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(errorMessages.application.notification.notFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class EventForNotificationNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            errorMessages.application.notification.eventForNotificationNotFound,
            ApplicationErrorCodes.RESOURCE_NOT_FOUND,
            context,
        );
    }
}
