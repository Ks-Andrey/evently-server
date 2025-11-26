import { ERROR_MESSAGES } from '@common/constants/errors';

import { DomainException } from '../../common/exceptions';

export class CommentTextCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.comment.textCannotBeEmpty);
    }
}

export class CommentIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.comment.idCannotBeEmpty);
    }
}

export class CommentEventIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.comment.eventIdCannotBeEmpty);
    }
}

export class CommentAuthorIsRequiredException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.comment.authorIsRequired);
    }
}

export class CannotEditDeletedCommentException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.comment.cannotEditDeleted);
    }
}

export class CommentAlreadyDeletedException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.comment.alreadyDeleted);
    }
}

export class CommentUserIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.comment.userIdCannotBeEmpty);
    }
}

export class CommentUsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.comment.usernameCannotBeEmpty);
    }
}
