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
            ? `${ERROR_MESSAGES.application.common.unknownError}: ${errorText}`
            : ERROR_MESSAGES.application.common.unknownError;
        super(message, ApplicationErrorCodes.UNKNOWN_ERROR, context);
    }
}

export class AccessDeniedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.common.accessDenied, ApplicationErrorCodes.ACCESS_DENIED, context);
    }
}

export class NotAuthenticatedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.common.notAuthenticated, ApplicationErrorCodes.NOT_AUTHENTICATED, context);
    }
}

export class RouteNotFoundException extends ApplicationException {
    constructor() {
        super(ERROR_MESSAGES.application.common.routeNotFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND);
    }
}

export class InvalidInputException extends ApplicationException {
    constructor(errorText?: string, context?: Record<string, unknown>) {
        const message = errorText ?? ERROR_MESSAGES.application.common.invalidInput;
        super(message, ApplicationErrorCodes.INVALID_INPUT, context);
    }
}

export class FileStorageMoveException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.fileStorage.moveFailed, ApplicationErrorCodes.UNKNOWN_ERROR, context);
    }
}

export class FileStorageDeleteException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.fileStorage.deleteFailed, ApplicationErrorCodes.UNKNOWN_ERROR, context);
    }
}

export class FileStorageFileNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.fileStorage.fileNotFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class FileStorageAccessDeniedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.fileStorage.accessDenied, ApplicationErrorCodes.ACCESS_DENIED, context);
    }
}

export class FileStorageIoException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.fileStorage.ioError, ApplicationErrorCodes.UNKNOWN_ERROR, context);
    }
}

export class CsrfOriginRequiredException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.security.csrfOriginRequired, ApplicationErrorCodes.ACCESS_DENIED, context);
    }
}

export class CsrfInvalidOriginException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.security.csrfInvalidOrigin, ApplicationErrorCodes.ACCESS_DENIED, context);
    }
}
