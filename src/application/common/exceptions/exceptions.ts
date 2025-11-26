import { ERROR_MESSAGES } from '@common/constants/errors';

import { ApplicationErrorCodes } from './error-codes';

export class ApplicationException extends Error {
    constructor(
        message: string,
        public readonly errorCode: string,
        public readonly context?: Record<string, unknown>,
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, ApplicationException.prototype);
    }
}

export class UnknownException extends ApplicationException {
    constructor(errorText?: string, context?: Record<string, unknown>) {
        const message = errorText
            ? `${ERROR_MESSAGES.domain.common.unknownError}: ${errorText}`
            : ERROR_MESSAGES.domain.common.unknownError;
        super(message, ApplicationErrorCodes.UNKNOWN_ERROR, context);
    }
}

export class InvalidInputException extends ApplicationException {
    constructor(errorText?: string, context?: Record<string, unknown>) {
        const message = errorText
            ? `${ERROR_MESSAGES.application.common.invalidInput}: ${errorText}`
            : ERROR_MESSAGES.application.common.invalidInput;
        super(message, ApplicationErrorCodes.INVALID_INPUT, context);
    }
}

export class AccessDeniedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.domain.common.accessDenied, ApplicationErrorCodes.ACCESS_DENIED, context);
    }
}
