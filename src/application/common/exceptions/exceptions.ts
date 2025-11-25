import { errorMessages } from '@common/config/errors';

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
            ? `${errorMessages.domain.common.unknownError}: ${errorText}`
            : errorMessages.domain.common.unknownError;
        super(message, ApplicationErrorCodes.UNKNOWN_ERROR, context);
    }
}

export class AccessDeniedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(errorMessages.domain.common.accessDenied, ApplicationErrorCodes.ACCESS_DENIED, context);
    }
}
