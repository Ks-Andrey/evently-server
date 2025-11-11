import { DomainException } from '../../shared/exception/domain-exception';

export class UserAlreadyBlockedException extends DomainException {
    constructor() {
        super('User already blocked');
    }
}

export class UserNotBlockedException extends DomainException {
    constructor() {
        super('User not blocked');
    }
}

export class InvalidEmailFormatException extends DomainException {
    constructor() {
        super('Invalid email format');
    }
}

export class UsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super('Username cannot be empty');
    }
}

export class PasswordHashCannotBeEmptyException extends DomainException {
    constructor() {
        super('Password hash cannot be empty');
    }
}
