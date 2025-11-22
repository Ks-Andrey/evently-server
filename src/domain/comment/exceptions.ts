import { domainErrorMessages } from '@common/config/errors';

import { DomainException } from '../common/exceptions';

export class CommentTextCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.comment.textCannotBeEmpty);
    }
}

export class CommentIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.comment.idCannotBeEmpty);
    }
}

export class CommentEventIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.comment.eventIdCannotBeEmpty);
    }
}

export class CommentAuthorIsRequiredException extends DomainException {
    constructor() {
        super(domainErrorMessages.comment.authorIsRequired);
    }
}

export class CannotEditDeletedCommentException extends DomainException {
    constructor() {
        super(domainErrorMessages.comment.cannotEditDeleted);
    }
}

export class CommentAlreadyDeletedException extends DomainException {
    constructor() {
        super(domainErrorMessages.comment.alreadyDeleted);
    }
}

export class CommentUserIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.comment.userIdCannotBeEmpty);
    }
}

export class CommentUsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.comment.usernameCannotBeEmpty);
    }
}
