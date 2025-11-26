import { ApplicationErrorCodes } from '@application/common/exceptions/error-codes';
import { ApplicationException } from '@application/common/exceptions/exceptions';
import { ERROR_MESSAGES } from '@common/constants/errors';

export class CommentNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.comment.notFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class CommentCannotEditDeletedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.comment.cannotEditDeleted,
            ApplicationErrorCodes.BUSINESS_RULE_VIOLATION,
            context,
        );
    }
}

export class UserForCommentNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.comment.userForCommentNotFound,
            ApplicationErrorCodes.RESOURCE_NOT_FOUND,
            context,
        );
    }
}

export class EventForCommentNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(
            ERROR_MESSAGES.application.comment.eventForCommentNotFound,
            ApplicationErrorCodes.RESOURCE_NOT_FOUND,
            context,
        );
    }
}
