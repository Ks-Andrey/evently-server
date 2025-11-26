import { ERROR_MESSAGES } from '@common/constants/errors';

import { DomainException } from '../../common/exceptions';

export class UserAlreadyBlockedException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.alreadyBlocked);
    }
}

export class UserNotBlockedException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.notBlocked);
    }
}

export class UserIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.idCannotBeEmpty);
    }
}

export class UserTypeIsRequiredException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.typeIsRequired);
    }
}

export class InvalidEmailFormatException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.invalidEmailFormat);
    }
}

export class UsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.usernameCannotBeEmpty);
    }
}

export class PasswordHashCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.passwordHashCannotBeEmpty);
    }
}

export class SubscriptionCountCannotBeNegativeException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.subscriptionCountCannotBeNegative);
    }
}

export class CannotDecrementSubscriptionCountBelowZeroException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.cannotDecrementSubscriptionBelowZero);
    }
}

export class UserTypeIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.typeIdCannotBeEmpty);
    }
}

export class UserTypeNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.typeNameCannotBeEmpty);
    }
}

export class PasswordNotVerified extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.passwordNotVerified);
    }
}

export class EmailAlreadyVerifiedException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.emailAlreadyVerified);
    }
}

export class PendingEmailAlreadyRequestedException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.pendingEmailAlreadyRequested);
    }
}

export class PendingEmailNotFoundException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.pendingEmailNotFound);
    }
}

export class PendingEmailMatchesCurrentException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.pendingEmailMatchesCurrent);
    }
}

export class PendingEmailMismatchException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.user.pendingEmailMismatch);
    }
}
