import { domainErrorMessages } from '@common/config/errors';

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

export class NotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(domainErrorMessages.common.notFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class AccessDeniedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(domainErrorMessages.common.accessDenied, ApplicationErrorCodes.ACCESS_DENIED, context);
    }
}

export class UnknownException extends ApplicationException {
    constructor(errorText?: string, context?: Record<string, unknown>) {
        const message = errorText
            ? `${domainErrorMessages.common.unknownError}: ${errorText}`
            : domainErrorMessages.common.unknownError;
        super(message, ApplicationErrorCodes.UNKNOWN_ERROR, context);
    }
}

export class ValidationException extends ApplicationException {
    constructor(message?: string, context?: Record<string, unknown>) {
        super(message || domainErrorMessages.common.validationError, ApplicationErrorCodes.VALIDATION_ERROR, context);
    }
}

export class ConflictException extends ApplicationException {
    constructor(message?: string, context?: Record<string, unknown>) {
        super(message || domainErrorMessages.common.conflict, ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS, context);
    }
}
