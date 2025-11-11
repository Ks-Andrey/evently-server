import { DomainException } from '../../shared/exception/domain-exception';

export class InvalidEventDateException extends DomainException {
    constructor() {
        super('Invalid event date');
    }
}

export class UserAlreadySubscribedException extends DomainException {
    constructor() {
        super('User already subscribed to this event');
    }
}

export class UserNotSubscribedException extends DomainException {
    constructor() {
        super('User is not subscribed to this event');
    }
}

export class CategoryNameCannotBeEmptyException extends DomainException {
    constructor() {
        super('Category name cannot be empty');
    }
}
