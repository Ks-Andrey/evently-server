import { ApplicationErrorCodes } from '@application/common/exceptions/error-codes';
import { ApplicationException } from '@application/common/exceptions/exceptions';
import { errorMessages } from '@common/config/errors';

export class EventNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(errorMessages.application.event.notFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class EventAlreadyStartedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(errorMessages.application.event.alreadyStarted, ApplicationErrorCodes.BUSINESS_RULE_VIOLATION, context);
    }
}

export class UserAlreadySubscribedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            errorMessages.application.event.userAlreadySubscribed,
            ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS,
            context,
        );
    }
}

export class UserNotSubscribedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            errorMessages.application.event.userNotSubscribed,
            ApplicationErrorCodes.BUSINESS_RULE_VIOLATION,
            context,
        );
    }
}

export class UserForEventNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(errorMessages.application.event.userForEventNotFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class CategoryForEventNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            errorMessages.application.event.categoryForEventNotFound,
            ApplicationErrorCodes.RESOURCE_NOT_FOUND,
            context,
        );
    }
}
