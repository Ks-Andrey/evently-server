import { ApplicationErrorCodes } from '@application/common/exceptions/error-codes';
import { ApplicationException } from '@application/common/exceptions/exceptions';
import { errorMessages } from '@common/config/errors';

export class CommentNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(errorMessages.application.comment.notFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class CommentCannotEditDeletedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            errorMessages.application.comment.cannotEditDeleted,
            ApplicationErrorCodes.BUSINESS_RULE_VIOLATION,
            context,
        );
    }
}

export class UserForCommentNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            errorMessages.application.comment.userForCommentNotFound,
            ApplicationErrorCodes.RESOURCE_NOT_FOUND,
            context,
        );
    }
}

export class EventForCommentNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            errorMessages.application.comment.eventForCommentNotFound,
            ApplicationErrorCodes.RESOURCE_NOT_FOUND,
            context,
        );
    }
}
