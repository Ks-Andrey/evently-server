import { errorMessages } from '@common/config/errors';

import { DomainException } from '../../common/exceptions';

export class CommentTextCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.comment.textCannotBeEmpty);
    }
}

export class CommentIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.comment.idCannotBeEmpty);
    }
}

export class CommentEventIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.comment.eventIdCannotBeEmpty);
    }
}

export class CommentAuthorIsRequiredException extends DomainException {
    constructor() {
        super(errorMessages.domain.comment.authorIsRequired);
    }
}

export class CannotEditDeletedCommentException extends DomainException {
    constructor() {
        super(errorMessages.domain.comment.cannotEditDeleted);
    }
}

export class CommentAlreadyDeletedException extends DomainException {
    constructor() {
        super(errorMessages.domain.comment.alreadyDeleted);
    }
}

export class CommentUserIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.comment.userIdCannotBeEmpty);
    }
}

export class CommentUsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.comment.usernameCannotBeEmpty);
    }
}
