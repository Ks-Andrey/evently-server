import { ApplicationErrorCodes } from '@application/common/exceptions/error-codes';
import { ApplicationException } from '@application/common/exceptions/exceptions';
import { errorMessages } from '@common/config/errors';

export class CategoryNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(errorMessages.application.category.notFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class CategoryAlreadyExistsException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(errorMessages.application.category.alreadyExists, ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS, context);
    }
}

export class CategoryInUseException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(errorMessages.application.category.inUse, ApplicationErrorCodes.RESOURCE_IN_USE, context);
    }
}
