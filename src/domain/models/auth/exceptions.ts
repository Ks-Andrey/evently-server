import { errorMessages } from '@common/config/errors';

import { DomainException } from '../../common/exceptions';

export class EmailVerificationIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.auth.emailVerificationIdCannotBeEmpty);
    }
}

export class EmailVerificationUserIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.auth.emailVerificationUserIdCannotBeEmpty);
    }
}

export class EmailVerificationTokenCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.auth.emailVerificationTokenCannotBeEmpty);
    }
}

export class EmailVerificationAlreadyUsedException extends DomainException {
    constructor() {
        super(errorMessages.domain.auth.emailVerificationAlreadyUsed);
    }
}

export class EmailVerificationExpiredException extends DomainException {
    constructor() {
        super(errorMessages.domain.auth.emailVerificationExpired);
    }
}

export class EmailVerificationEmailCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.auth.emailVerificationEmailCannotBeEmpty);
    }
}

export class InvalidTokenPayloadException extends DomainException {
    constructor() {
        super(errorMessages.domain.auth.invalidTokenPayload);
    }
}

export class InactiveTokenException extends DomainException {
    constructor() {
        super(errorMessages.domain.auth.inactiveToken);
    }
}
