import { DomainException } from '../../shared/exception/domain-exception';

export class CommentTextCannotBeEmptyException extends DomainException {
    constructor() {
        super('Comment text cannot be empty');
    }
}

export class CannotEditDeletedCommentException extends DomainException {
    constructor() {
        super('Cannot edit deleted comment');
    }
}

export class CommentAlreadyDeletedException extends DomainException {
    constructor() {
        super('Comment already deleted');
    }
}
