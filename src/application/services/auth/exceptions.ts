import { ApplicationErrorCodes } from '@application/common/exceptions/error-codes';
import { ApplicationException } from '@application/common/exceptions/exceptions';
import { ERROR_MESSAGES } from '@common/constants/errors';

export class InvalidCredentialsException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.auth.invalidCredentials, ApplicationErrorCodes.INVALID_INPUT, context);
    }
}

export class EmailVerificationNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.auth.emailVerificationNotFound,
            ApplicationErrorCodes.RESOURCE_NOT_FOUND,
            context,
        );
    }
}

export class EmailVerificationExpiredException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.auth.emailVerificationExpired,
            ApplicationErrorCodes.BUSINESS_RULE_VIOLATION,
            context,
        );
    }
}

export class EmailVerificationAlreadyUsedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.auth.emailVerificationAlreadyUsed,
            ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS,
            context,
        );
    }
}

export class EmailVerificationAlreadyRequestedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.auth.emailVerificationAlreadyRequested,
            ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS,
            context,
        );
    }
}

export class UserForAuthNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.auth.userForAuthNotFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}
