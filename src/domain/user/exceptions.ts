import { domainErrorMessages } from '../../common/config/domain-error-messages';
import { DomainException } from '../common/exceptions';

export class UserAlreadyBlockedException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.alreadyBlocked);
    }
}

export class UserNotBlockedException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.notBlocked);
    }
}

export class UserIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.idCannotBeEmpty);
    }
}

export class UserTypeIsRequiredException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.typeIsRequired);
    }
}

export class InvalidEmailFormatException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.invalidEmailFormat);
    }
}

export class UsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.usernameCannotBeEmpty);
    }
}

export class PasswordHashCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.passwordHashCannotBeEmpty);
    }
}

export class SubscriptionCountCannotBeNegativeException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.subscriptionCountCannotBeNegative);
    }
}

export class CannotDecrementSubscriptionCountBelowZeroException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.cannotDecrementSubscriptionBelowZero);
    }
}

export class UserTypeIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.typeIdCannotBeEmpty);
    }
}

export class UserTypeNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.typeNameCannotBeEmpty);
    }
}
