import { domainErrorMessages } from '@common/config/errors';

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

export class UserAlreadyExists extends DomainException {
    constructor() {
        super(domainErrorMessages.user.userAlreadyExists);
    }
}

export class PasswordNotVerified extends DomainException {
    constructor() {
        super(domainErrorMessages.user.passwordNotVerified);
    }
}

export class EmailAlreadyVerifiedException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.emailAlreadyVerified);
    }
}

export class PendingEmailAlreadyRequestedException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.pendingEmailAlreadyRequested);
    }
}

export class PendingEmailNotFoundException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.pendingEmailNotFound);
    }
}

export class PendingEmailMatchesCurrentException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.pendingEmailMatchesCurrent);
    }
}

export class PendingEmailMismatchException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.pendingEmailMismatch);
    }
}

export class UserEventIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.userEventIdCannotBeEmpty);
    }
}

export class UserEventNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.userEventNameCannotBeEmpty);
    }
}

export class UserEventSubscriptionsCountCannotBeNegativeException extends DomainException {
    constructor() {
        super(domainErrorMessages.user.userEventSubscriptionsCountCannotBeNegative);
    }
}
