import { ApplicationErrorCodes } from '@application/common/exceptions/error-codes';
import { ApplicationException } from '@application/common/exceptions/exceptions';
import { ERROR_MESSAGES } from '@common/constants/errors';

export class UserTypeNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.userType.notFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class UserTypeAlreadyExistsException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.userType.alreadyExists,
            ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS,
            context,
        );
    }
}

export class UserTypeInUseException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.userType.inUse, ApplicationErrorCodes.RESOURCE_IN_USE, context);
    }
}
