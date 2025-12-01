import { ApplicationErrorCodes } from '@application/common/exceptions/error-codes';
import { ApplicationException } from '@application/common/exceptions/exceptions';
import { ERROR_MESSAGES } from '@common/constants/errors';

export class UserNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.user.notFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class UserAlreadyExistsException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.user.alreadyExists, ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS, context);
    }
}

export class UserTypeNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.user.userTypeNotFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class EventForUserNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.user.eventForUserNotFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class EmailVerificationForUserAlreadyRequestedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.user.emailVerificationForUserAlreadyRequested,
            ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS,
            context,
        );
    }
}

export class UserAlreadySubscribedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.event.userAlreadySubscribed,
            ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS,
            context,
        );
    }
}

export class UserNotSubscribedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.event.userNotSubscribed,
            ApplicationErrorCodes.BUSINESS_RULE_VIOLATION,
            context,
        );
    }
}

export class EmailSendException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.email.sendFailed, ApplicationErrorCodes.UNKNOWN_ERROR, context);
    }
}
